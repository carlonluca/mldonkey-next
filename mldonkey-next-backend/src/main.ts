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
import express from "express"
import cookieParser from 'cookie-parser'
import cookie from 'cookie'
import path from 'path'
import http from 'http'
import * as fs from 'fs'
import { logger } from './core/MLLogger'
import { MLBridgeManager } from './core/MLBridgeManager'
import { IncomingMessage } from 'http'
import { Tail } from 'tail'
import crypto from 'crypto'

const wss = new WebSocket.Server({ port: 4002 });
const wssLog = new WebSocket.Server({ port: 4003 })
const bridgeManager = new MLBridgeManager()
const logToken = crypto.randomBytes(16).toString('hex')

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

logger.info('WebSocket server listening on port: 4002')

fs.readFile(`/var/lib/mldonkey/downloads.ini`, {
    encoding : 'utf-8'
}, (err: NodeJS.ErrnoException | null, data: string) => {
    if (err) {
        logger.warn(`Cannot read mlnet conf file: ${err.message}`)
        return
    }

    const regex = /log_file\s*=\s*"([^"]*)"/
    const match = data.match(regex)
    let logFile = "mlnet.log"
    if (match && match[1])
        logFile = match[1]
    
    logFile = `/var/lib/mldonkey/${logFile}`
    wssLog.on("connection", (ws: WebSocket, req: IncomingMessage) => {
        const cookies = cookie.parse(req.headers.cookie || '')
        const token = cookies.logtoken
        if (process.env.ML_DISABLE_LOGS_AUTH != "1" && token !== logToken) {
            logger.warn("Client refused")
            ws.close()
            return
        }

        logger.info(`Client connected: ${req.socket.remoteAddress} ${ws}`)
        if (!fs.existsSync(logFile)) {
            ws.send("")
            ws.close()
            return
        }
        const tail = new Tail(logFile, {
            separator: /[\r]{0,1}\n/,
            fromBeginning: true,
            follow: true
        })
        tail.on("line", (data: string) => ws.send(data + "\n"))
        tail.on("error", (error) => {
            logger.warn(`Error occurred following log file: ${error}`)
            ws.close()
        })
        ws.on('close', () => {
            logger.info("WebSocket closed")
            tail.unwatch()
        })
        ws.on('error', (_ws: WebSocket, err: Error) => {
            logger.warn(`WebSocket failed: ${err.message}`)
            tail.unwatch()
        })
    })

    logger.debug(`mldonkey setup to store logs in ${logFile}`)
    logger.info("WebSocket server listening on port: 4003")
})

const app = express()
const port = process.env.MLDONKEY_NEXT_WEBAPP_PORT || 4081
const webappPath = process.env.MLDONKEY_NEXT_WEBAPP_ROOT

app.use(cookieParser())
app.use((req, res, next) => {
    if (req.path.includes("/home/corelogs")) {
        logger.debug("Add cookie")
        res.cookie('logtoken', logToken, { httpOnly: true })
    }
    next()
})
app.use("/", express.static(webappPath))
app.get("/", (req, res) => res.sendFile(path.join(webappPath, 'index.html')))
/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((req, res, next) => res.redirect('/'))

const server = http.createServer(app)
server.listen(port, () =>
    logger.info(`HTTP server listening on: http://localhost:${port}`))
