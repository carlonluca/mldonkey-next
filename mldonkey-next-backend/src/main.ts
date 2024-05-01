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
 * Date:    2023.08.06
 * Company: -
 */

import WebSocket from 'ws'
import { logger } from './core/MLLogger'
import { MLBridgeManager } from './core/MLBridgeManager'
import { IncomingMessage } from 'http';
import express, { Express, Request, Response } from "express"
import path from 'path'
import http from 'http'

const wss = new WebSocket.Server({ port: 4002 });
const bridgeManager = new MLBridgeManager();

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    logger.info(`Client connected: ${req.socket.remoteAddress} ${ws}`)
    bridgeManager.clientConnected(ws)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ws.on('close', (_ws: WebSocket, _req: IncomingMessage) => {
        bridgeManager.clientDisconnected(ws)
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ws.on("error", (_ws: WebSocket, err: Error) => {
        logger.warn(`Client failed: ${err.message}`)
        bridgeManager.clientDisconnected(ws)
    })
})

console.log('WebSocket server listening on port: 4002');

const app = express()
const port = process.env.MLDONKEY_NEXT_WEBAPP_PORT || 4081
const webappPath = process.env.MLDONKEY_NEXT_WEBAPP_ROOT

app.get("/", function(req, res) {
    res.sendFile(path.join(webappPath, 'index.html'))
})
app.use("/", express.static(webappPath))

const server = http.createServer(app)
server.listen(port, () =>
    console.log(`HTTP server listening on: http://localhost:${port}`))
