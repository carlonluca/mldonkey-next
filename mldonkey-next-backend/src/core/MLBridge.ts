import * as net from 'net'
import { CONNECTING, WebSocket } from 'ws'
import { logger } from './MLLogger'
import { connect } from 'http2'

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
    constructor(
        public webSocket: WebSocket
    ) {
        this.mlSocket = new net.Socket()
        this.mlSocket.connect(PORT, HOST, function () {
            logger.info(`Connected to: ${HOST}:${PORT}`)
        })
        this.mlSocket.on('data', function (data: Buffer) {
            logger.verbose(`Sending data to client`)
            webSocket.send(data)
        })
        this.mlSocket.on('close', function () {
            logger.info('Connection closed')
            // TODO
        })
    }

    public dispose() {
        this.webSocket.close()
    }
}
