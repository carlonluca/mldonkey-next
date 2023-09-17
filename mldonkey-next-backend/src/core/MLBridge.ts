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
 * Date:    2023.08.06
 * Company: -
 */

import * as net from 'net'
import { WebSocket } from 'ws'
import { logger } from './MLLogger'

const HOST = '192.168.0.2'
const PORT = 4001

/**
 * Represents a bridge between a browser app and the mlnet core.
 */
export class MLBridge {
    public mlSocket: net.Socket

    /**
     * Receives a connected websocket and connects to the mlnet core.
     * 
     * @param webSocket 
     * @param mlSocket 
     */
    constructor(public webSocket: WebSocket) {
        this.reconnect()
    }

    reconnect() {
        this.mlSocket = new net.Socket()
        this.mlSocket.connect(PORT, HOST, () => {
            logger.info(`Connected to: ${HOST}:${PORT}`)
        })
        this.mlSocket.on('data', (data: Buffer) => {
            logger.verbose(`Sending data to client`)
            this.webSocket.send(data)
        })
        this.mlSocket.on('close', () => {
            logger.info('Connection closed')
        })
        this.mlSocket.on('error', (error) => {
            logger.warn(`Connection error: ${error.message}`)
            this.webSocket.close()
        })
        this.mlSocket.on('timeout', () => {
            logger.warn("Connection timed out")
            this.webSocket.close()
        })
        this.webSocket.on("message", data => {
            logger.verbose(`Sending data to mlnet core`)
            this.mlSocket.write(data as Buffer)
        })
    }

    public dispose() {
        this.webSocket.close()
    }
}
