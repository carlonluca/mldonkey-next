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
import http, { request } from 'http'
import * as fs from 'fs'
import { logger } from './core/MLLogger'
import { MLBridgeManager } from './core/MLBridgeManager'
import { IncomingMessage } from 'http'
import { Tail } from 'tail'
import crypto from 'crypto'
import * as MLConstants from './core/MLConstants'
import { RequestOptions } from 'node:http'

const wss = new WebSocket.Server({ port: 4002 });
const wssLog = new WebSocket.Server({ port: 4003 })
const bridgeManager = new MLBridgeManager()
const logToken = crypto.randomBytes(16).toString('hex')

const wssOnConnection = (ws: WebSocket, req: IncomingMessage) => {
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
}

wss.on('connection', wssOnConnection)
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
        if (process.env.MLDONKEY_DISABLE_LOGS_AUTH != "1" && token !== logToken) {
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
            fromBeginning: process.env.MLDONKEY_LOGS_FROM_BEGINNING == "1",
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
const port = MLConstants.MLDONKEY_NEXT_WEBAPP_PORT
const webappPath = MLConstants.MLDONKEY_NEXT_WEBAPP_ROOT
const httpPort = MLConstants.MLDONKEY_CORE_WEB_PORT
const httpHost = MLConstants.MLDONKEY_CORE_HOST

app.use(cookieParser())
app.get('/previewUpload', (clientReq, clientRes) => {
    const fileId = clientReq.query.id
    if (!fileId)
        return clientRes.status(400).send('Missing "id" parameter')

    const username = clientReq.query.uname
    if (!username)
        return clientRes.status(400).send('Missing "username" parameter')

    const passwd = clientReq.query.passwd
    let auth = `${username}:`
    if (passwd)
        auth += passwd

    let corePort = httpPort
    try {
        corePort = parseInt(clientReq.query.coreport as string)
        corePort = isNaN(corePort) ? httpPort : corePort
    }
    catch (_e) {
        logger.warn("Error: " + _e)
    }

    const options: RequestOptions = {
        hostname: httpHost,
        port: corePort,
        path: `/preview_upload?q=${fileId}`,
        method: 'GET',
        headers: {
            authorization: 'Basic ' + Buffer.from(auth).toString('base64')
        }
    }
    const proxy = request(options, res => {
        clientRes.writeHead(res.statusCode, res.headers)
        res.pipe(clientRes, {
          end: true
        })
    })

    proxy.on("error", err => {
        logger.warn("Proxy request error:", err)
        if (!clientRes.headersSent)
            clientRes.writeHead(500, { "Content-type": "text/plain" })
        clientRes.send("Internal server error")
    })

    clientReq.on("error", err => {
        logger.warn("Client request error:", err)
        proxy.destroy()
    })

    clientRes.on("error", err => {
        logger.warn("Client response error:", err)
        proxy.destroy()
    })

    clientReq.pipe(proxy, {
        end: true
    })
})
app.use((_req, res, next) => {
    res.cookie('logtoken', logToken, { httpOnly: true })
    next()
})
app.use("/", express.static(webappPath))
app.get("/", (_req, res) => res.sendFile(path.join(webappPath, 'index.html')))
/* eslint-disable @typescript-eslint/no-unused-vars */
app.use((_req, res, next) => res.redirect('/'))

const server = http.createServer(app)

// This is an optional websocket server listening on the same port
// of the http server. The other websocket server remains for backward
// compatibility.
const wss2 = new WebSocket.Server({ server, path: "/ws" })
wss2.on('connection', wssOnConnection)
logger.info(`WebSocket server listening on port: ${port}`)

server.listen(port, () =>
    logger.info(`HTTP server listening on: http://localhost:${port}`))
