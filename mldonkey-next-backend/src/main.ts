import * as net from 'net'
import { logger } from './core/MLLogger'

import WebSocket from 'ws'
import { IncomingMessage } from 'http'
import { MLBridgeManager } from './core/MLBridgeManager'

const wss = new WebSocket.Server({ port: 8080 });
const bridgeManager = new MLBridgeManager();

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    console.log("Client connected")
    bridgeManager.clientConnected(ws)

    ws.on('close', () => {
        console.log('Client disconnected')
        bridgeManager.clientDisconnected(ws)
    })
    ws.on("error", (ws: WebSocket, err: Error) => {
        logger.warn(`Client failed: ${err.message}`)
    })
})

console.log('WebSocket server listening on port 8080');
