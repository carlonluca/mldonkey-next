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


const bridgeManager = new MLBridgeManager()
const logToken = crypto.randomBytes(16).toString('hex')

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
app.use((req, res, next) => {
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === "websocket")
    return next()
  if (req.path.startsWith("/ws"))
    return next()
  res.redirect("/")
})

const server = http.createServer(app)

const wss = new WebSocket.Server({ noServer: true })
wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    logger.info(`App WS client connected: ${req.socket.remoteAddress}`)
    bridgeManager.clientConnected(ws)
    ws.on('close', () => bridgeManager.clientDisconnected(ws))
    ws.on("error", (err: Error) => {
        logger.warn(`App WS error: ${err.message}`)
        bridgeManager.clientDisconnected(ws)
    })
})

let logFile = "mlnet.log"
fs.readFile(`/var/lib/mldonkey/downloads.ini`, { encoding : 'utf-8' }, (err, data) => {
    if (!err) {
        const regex = /log_file\s*=\s*"([^"]*)"/
        const match = data.match(regex)
        if (match && match[1]) logFile = match[1]
    }
    logFile = `/var/lib/mldonkey/${logFile}`
    logger.debug(`mldonkey setup to store logs in ${logFile}`)
})

const wssLog = new WebSocket.Server({ noServer: true })
wssLog.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const cookies = cookie.parse(req.headers.cookie || '')
    const token = cookies.logtoken
    if (!MLConstants.MLDONKEY_NEXT_ENABLE_LOG_STREAM) {
        logger.warn("Log WS client refused")
        ws.close()
        return
    }

    if (process.env.MLDONKEY_DISABLE_LOGS_AUTH != "1" && token !== logToken) {
        logger.warn("Log WS client refused")
        ws.close()
        return
    }
    logger.info(`Log WS client connected: ${req.socket.remoteAddress}`)
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
        logger.warn(`Error tailing log: ${error}`)
        ws.close()
    })
    ws.on('close', () => tail.unwatch())
    ws.on('error', (err: Error) => {
        logger.warn(`Log WS error: ${err.message}`)
        tail.unwatch()
    })
})

server.on("upgrade", (req, socket, head) => {
    const { url } = req
    if (url?.startsWith("/ws"))
        wss.handleUpgrade(req, socket, head, (ws) => wss.emit("connection", ws, req))
    else if (url?.startsWith("/logstream"))
        wssLog.handleUpgrade(req, socket, head, (ws) => wssLog.emit("connection", ws, req))
    else
        socket.destroy()
})

server.listen(port, () => {
    logger.info(`HTTP + WS server listening on: localhost:${port}`)
})
