/*
 * This file is part of mldonkey-next.
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
import { MLMessageBadPassword, MLMessageCoreProtocol, MLMsgFrom, MLMessageTypeFrom } from './msg/MLMsg'
import { MLMsgFromConsole } from './msg/MLMsgConsole'
import { MLMsgFromNetInfo } from './msg/MLMsgNetInfo'
import { MLMsgFromFileDownloaded, MLMsgFromDownloadFile } from './msg/MLMsgDownload'
import { MLMsgFromFileInfo } from './msg/MLMsgFileInfo'
import { MLMsgFromResultInfo, MLMsgFromSearch, MLMsgFromSearchResult } from './msg/MLMsgQuery'
import { wsLogger } from './core/MLLogger'
import { MLMsgFromAddSectionOption, MLMsgFromOptionsInfo } from './msg/MLMsgOptions'
import { MLMsgFromSysInfo } from './msg/MLMsgSysInfo'
import { MLMsgFromClientStats } from './msg/MLMsgClientStats'
import { MLMsgFromUploaders } from './msg/MLMsgUploaders'
import { MLMsgFromBwHUpDown, MLMsgFromBwUpDown, MLMsgFromStats } from './msg/MLMsgStats'
import { MLSubscriptionSet } from './core/MLSubscriptionSet'
import { MLMsgFromServerInfo } from './msg/MLMsgServer'

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
    private protocol = 0
    private subscriptions = new MLSubscriptionSet()

    constructor() {
        this.networkManager = new MLNetworkManager(this)
    }

    public connect(url: string): void {
        if (this.connectionState.value != MLConnectionState.S_NOT_CONNECTED)
            return
        this.disconnect()
        this.webSocket = webSocket<ArrayBuffer>({
            url: url,
            binaryType: "arraybuffer",
            deserializer: (e: MessageEvent) => e.data,
            serializer: (b: ArrayBuffer) => b,
            openObserver: {
                next: _ => {
                    this.connectionState.value = MLConnectionState.S_CONNECTED
                }
            }
        })
        this.subscriptions.add(
            this.webSocket.subscribe({
                next: (data: ArrayBuffer) => this.onMessageReceived(data),
                error: (error) => this.onError(error),
                complete: () => this.onClose()
            })
        )
    }

    public disconnect(): void {
        this.webSocket?.complete()
        this.subscriptions.unsubscribe(null)
        this.connectionState.value = MLConnectionState.S_NOT_CONNECTED
    }

    public login(usr: string, pwd: string) {
        this.sendMsg(new ML.MLMessageToPassword(usr, pwd))
    }

    public sendData(msg: ArrayBuffer) {
        wsLogger.debug("-> ", MLUtils.buf2hex(msg))
        this.webSocket.next(msg)
    }

    public sendMsg(msg: ML.MLMsgTo) {
        this.sendData(msg.toBuffer())
    }

    private onMessageReceived(data: ArrayBuffer): void {
        this.buffer = MLUtils.concatArrayBuffers(this.buffer, data)
        wsLogger.debug('<-' , MLUtils.buf2hex(this.buffer))

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const [msg, consumed, tryAgain] = WebSocketService.processBuffer(this.buffer, this.protocol)
            this.buffer = this.buffer.slice(consumed)
            if (!msg && !tryAgain)
                break
            if (!msg)
                continue
            wsLogger.info("<- Message received:", msg.type)
            if (msg.type == ML.MLMessageTypeFrom.T_CORE_PROTOCOL) {
                const protocolMsg = msg as MLMessageCoreProtocol
                wsLogger.info(`Core protocol version: ${protocolMsg.version}`)
                const response = new ML.MLMessageGuiProtocol(protocolMsg.version)
                this.sendMsg(response)
                this.protocol = protocolMsg.version
            }
            else if (msg.type != ML.MLMessageTypeFrom.T_BAD_PASSWORD)
                this.connectionState.value = MLConnectionState.S_AUTHENTICATED
            this.lastMessage.value = msg
            if (!tryAgain)
                break
        }
    }

    private onError(error: unknown): void {
        wsLogger.error('WebSocket error:', error)
        this.connectionState.value = MLConnectionState.S_NOT_CONNECTED
    }

    private onClose(): void {
        wsLogger.info('WebSocket connection closed.')
        this.connectionState.value = MLConnectionState.S_NOT_CONNECTED
    }

    /**
     * Parses the buffer. Returns a message if parsed successfully and the number
     * of consumed bytes.
     * 
     * @param data 
     * @returns 
     */
    private static processBuffer(buffer: ArrayBuffer, protocol: number): [MLMsgFrom | null, number, boolean] {
        const SIZE_HEADER = 6
        const SIZE_SIZE = 4
        const SIZE_OPCODE = 2

        if (buffer.byteLength < SIZE_HEADER) {
            wsLogger.debug("Insufficient data")
            return [null, 0, false]
        }

        const dataView = new DataView(buffer)
        const size = dataView.getInt32(0, true) - SIZE_OPCODE
        wsLogger.debug(`<- Size: ${size} - ${MLUtils.buf2hex(buffer.slice(0, 4))}`)

        const opcode = dataView.getInt16(SIZE_SIZE, true)
        wsLogger.info(`<- Opcode: ${MLMessageTypeFrom[opcode]} (${opcode})`)

        if (opcode == -1 || size < 0) {
            wsLogger.warn(`Malformed packet: ${opcode} - ${size}`)
            buffer.slice(6)
            return [null, 0, true]
        }

        if (buffer.byteLength >= SIZE_HEADER + size) {
            wsLogger.debug("Full message received:", MLUtils.buf2hex(buffer.slice(0, SIZE_HEADER + size)))
            buffer = buffer.slice(SIZE_HEADER)

            const data = buffer.slice(0, size)
            buffer = buffer.slice(size)
            switch (opcode) {
            case MLMessageTypeFrom.T_CORE_PROTOCOL:
                return [MLMessageCoreProtocol.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_RESULT_INFO: {
                const msg = MLMsgFromResultInfo.fromBuffer(data, protocol)
                return [msg, size + SIZE_HEADER, !!msg]
            }
            case MLMessageTypeFrom.T_SEARCH_RESULT:
                return [MLMsgFromSearchResult.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_CONSOLE:
                return [MLMsgFromConsole.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_NETWORK_INFO:
                return [MLMsgFromNetInfo.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V1:
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V2:
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V3:
                wsLogger.warn("Obsolete download files message received")
                return [null, size + SIZE_HEADER, false]
            case MLMessageTypeFrom.T_DOWNLOAD_FILES:
            case MLMessageTypeFrom.T_DOWNLOAD_FILES_V4:
                return [MLMsgFromDownloadFile.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_FILE_DOWNLOADED:
            case MLMessageTypeFrom.T_FILE_DOWNLOADED_V1:
                return [MLMsgFromFileDownloaded.fromBuffer(data, opcode), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_FILE_INFO_V1:
            case MLMessageTypeFrom.T_FILE_INFO_V2:
                wsLogger.warn("Obsolete file info message received")
                return [null, size + SIZE_HEADER, false]
            case MLMessageTypeFrom.T_FILE_INFO_V3:
            case MLMessageTypeFrom.T_FILE_INFO:
                return [MLMsgFromFileInfo.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_BAD_PASSWORD:
                return [new MLMessageBadPassword(), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_SEARCH:
                return [MLMsgFromSearch.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_OPTIONS_INFO:
                return [MLMsgFromOptionsInfo.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_ADD_SECTION_OPTION:
                return [MLMsgFromAddSectionOption.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_CLIENT_STATS:
            case MLMessageTypeFrom.T_CLIENT_STATS_V1:
            case MLMessageTypeFrom.T_CLIENT_STATS_V2:
            case MLMessageTypeFrom.T_CLIENT_STATS_V3:
                return [MLMsgFromClientStats.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_SYSINFO:
                return [MLMsgFromSysInfo.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_UPLOAD_FILES:
                return [MLMsgFromUploaders.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_STATS:
                return [MLMsgFromStats.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_BW_UP_DOWN:
                return [MLMsgFromBwUpDown.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_BW_H_UP_DOWN:
                return [MLMsgFromBwHUpDown.fromBuffer(data), size + SIZE_HEADER, true]
            case MLMessageTypeFrom.T_SERVER_INFO:
                return [MLMsgFromServerInfo.fromBuffer(data), size + SIZE_HEADER, true]
            default:
                wsLogger.warn(`Unknown msg with opcode: ${MLMessageTypeFrom[opcode]} (${opcode})`)
                return [null, size + SIZE_HEADER, true]
            }
        }
        else
            wsLogger.debug("Insufficient data")

        return [null, 0, false]
    }
}
