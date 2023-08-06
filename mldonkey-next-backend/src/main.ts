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

import { logger } from './core/MLLogger'
import WebSocket from 'ws'
import { MLBridgeManager } from './core/MLBridgeManager'

const wss = new WebSocket.Server({ port: 8080 });
const bridgeManager = new MLBridgeManager();

wss.on('connection', (ws: WebSocket /* , _req: IncomingMessage */) => {
    console.log("Client connected")
    bridgeManager.clientConnected(ws)

    ws.on('close', () => {
        console.log('Client disconnected')
        bridgeManager.clientDisconnected(ws)
    })
    ws.on("error", (_ws: WebSocket, err: Error) => {
        logger.warn(`Client failed: ${err.message}`)
    })
})

console.log('WebSocket server listening on port 8080');
