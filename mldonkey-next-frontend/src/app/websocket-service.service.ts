/*
 * This file is part of mldonket-next.
 *
 * Copyright (c) 2023 Luca Carlon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 14.08.2023
 */

import { Injectable } from '@angular/core'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import * as ML from './msg/MLMsg'
import { MLObservableVariable } from './core/MLObservableVariable'
import { MLUtils } from './core/MLUtils'
import { MLNetworkManager } from './core/MLNetworkManager'
import { logger } from './core/MLLogger'
import { MLMessageBadPassword, MLMessageCoreProtocol, MLMsgFrom, MLMessageTypeFrom } from './msg/MLMsg'
import { MLMsgFromConsole } from './msg/MLMsgConsole'
import { MLMsgFromNetInfo } from './msg/MLMsgNetInfo'
import { MLMsgFromFileDownloaded, MLMsgFromDownloadFile } from './msg/MLMsgDownload'
import { MLMsgFromFileInfo } from './msg/MLMsgFileInfo'
import { MLMsgFromSearch } from './msg/MLMsgQuery'

export enum MLConnectionState {
    S_NOT_CONNECTED,
    S_CONNECTED,
    S_AUTHENTICATED
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    public webSocket!: WebSocketSubject<ArrayBuffer>
    public connectionState: MLObservableVariable<MLConnectionState> =
        new MLObservableVariable<MLConnectionState>(MLConnectionState.S_NOT_CONNECTED)
    public lastMessage: MLObservableVariable<ML.MLMsgFrom> =
        new MLObservableVariable<ML.MLMsgFrom>(new ML.MLMsgFromNone())
    public networkManager: MLNetworkManager

    private buffer: ArrayBuffer = new ArrayBuffer(0)

    constructor() {
        this.networkManager = new MLNetworkManager(this)
    }

    public connect(url: string): void {
        this.webSocket = webSocket<ArrayBuffer>({
            url: url,
            binaryType: "arraybuffer",
            deserializer: (e: MessageEvent) => e.data,
            serializer: (b: ArrayBuffer) => b,
            openObserver: {
                next: value => {
                    this.connectionState.value = value ? MLConnectionState.S_CONNECTED : MLConnectionState.S_NOT_CONNECTED
                }
            }
        })
        this.webSocket.subscribe({
            next: (data: ArrayBuffer) => this.onMessageReceived(data),
            error: (error) => this.onError(error),
            complete: () => this.onClose()
        })
    }

    public login(usr: string, pwd: string) {
        this.sendMsg(new ML.MLMessageToPassword(usr, pwd))
    }

    public sendData(msg: ArrayBuffer) {
        logger.debug("-> ", MLUtils.buf2hex(msg))
        this.webSocket.next(msg)
    }

    public sendMsg(msg: ML.MLMsgTo) {
        this.sendData(msg.toBuffer())
    }

    private onMessageReceived(data: ArrayBuffer): void {
        this.buffer = MLUtils.concatArrayBuffers(this.buffer, data)
        logger.debug('<-' , MLUtils.buf2hex(this.buffer))
        logger.debug("Buffer size:", this.buffer.byteLength)

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const [msg, consumed, tryAgain] = WebSocketService.processBuffer(this.buffer)
            this.buffer = this.buffer.slice(consumed)
            logger.debug("Buffer size:", this.buffer.byteLength)
            if (!msg && !tryAgain)
                break
            if (!msg)
                continue
            logger.info("<- Message received:", msg.type)
            if (msg.type == ML.MLMessageTypeFrom.T_CORE_PROTOCOL)
                this.sendMsg(new ML.MLMessageGuiProtocol(33))
            else if (msg.type != ML.MLMessageTypeFrom.T_BAD_PASSWORD)
                this.connectionState.value = MLConnectionState.S_AUTHENTICATED
            this.lastMessage.value = msg
            if (!tryAgain)
                break
        }
    }

    private onError(error: unknown): void {
        logger.error('WebSocket error:', error)
    }

    private onClose(): void {
        logger.info('WebSocket connection closed.')
    }

    /**
     * Parses the buffer. Returns a message if parsed successfully and the number
     * of consumed bytes.
     * 
     * @param data 
     * @returns 
     */
    private static processBuffer(buffer: ArrayBuffer): [MLMsgFrom | null, number, boolean] {
        const SIZE_HEADER = 6
        const SIZE_SIZE = 4
        const SIZE_OPCODE = 2

        if (buffer.byteLength < SIZE_HEADER) {
            logger.debug("Insufficient data")
            return [null, 0, false]
        }

        const dataView = new DataView(buffer)
        const size = dataView.getInt32(0, true) - SIZE_OPCODE
        logger.debug(`<- Size: ${size} - ${MLUtils.buf2hex(buffer.slice(0, 4))}`)

        const opcode = dataView.getInt16(SIZE_SIZE, true)
        logger.info(`<- Opcode: ${MLMessageTypeFrom[opcode]} (${opcode})`)

        if (opcode == -1 || size < 0) {
            logger.warn(`Malformed packet: ${opcode} - ${size}`)
            buffer.slice(6)
            return [null, 0, true]
        }

        if (buffer.byteLength >= SIZE_HEADER + size) {
            logger.debug("Full message received:", MLUtils.buf2hex(buffer.slice(0, SIZE_HEADER + size)))
            buffer = buffer.slice(SIZE_HEADER)

            const data = buffer.slice(0, size)
            buffer = buffer.slice(size)
            switch (opcode) {
            case MLMessageTypeFrom.T_CORE_PROTOCOL:
                return [MLMessageCoreProtocol.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_CONSOLE:
                return [MLMsgFromConsole.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_NETWORK_INFO:
                return [MLMsgFromNetInfo.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V1:
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V2:
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V3:
                logger.warn("Obsolete download files message received")
                return [null, size + SIZE_HEADER, false]
            case MLMessageTypeFrom.T_DOWNLOAD_FILES:
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V4:
                return [MLMsgFromDownloadFile.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_FILE_DOWNLOADED:
            case MLMessageTypeFrom.T_FILE_DOWNLOADED_V1:
                return [MLMsgFromFileDownloaded.fromBuffer(data, opcode), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_FILE_INFO_V1:
            case MLMessageTypeFrom.T_FILE_INFO_V2:
                logger.warn("Obsolete file info message received")
                return [null, size + SIZE_HEADER, false]
            case MLMessageTypeFrom.T_FILE_INFO_V3:
            case MLMessageTypeFrom.T_FILE_INFO:
                return [MLMsgFromFileInfo.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_BAD_PASSWORD:
                return [new MLMessageBadPassword(), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_SEARCH:
                return [MLMsgFromSearch.fromBuffer(data), size + SIZE_HEADER, true]
            default:
                logger.warn(`Unknown msg with opcode: ${MLMessageTypeFrom[opcode]} (${opcode})`)
                return [null, size + SIZE_HEADER, true]
            }
        }
        else
            logger.debug("Insufficient data")

        return [null, 0, false]
    }
}
