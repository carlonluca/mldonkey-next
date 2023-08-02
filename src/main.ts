import * as net from 'net'
import { logger  } from './core/MLLogger'
import {
    MLMessage,
    MLMessageGuiProtocol,
    MLMessageTo,
    MLMessageToPassword,
    MLMessageTypeFrom
} from './data/MLMessage'

const HOST = '192.168.0.2'
const PORT = 4001
let buffer = Buffer.alloc(0);

const client = new net.Socket();
client.connect(PORT, HOST, function () {
    logger.info(`Connected to: ${HOST}:${PORT}`)
})

client.on('data', function (data: Buffer) {
    buffer = Buffer.concat([buffer, data])
    const msg = MLMessage.processBuffer(data)
    if (!msg)
        return
    logger.info(`Message received: ${msg.type}`)
    if (msg.type == MLMessageTypeFrom.T_CORE_PROTOCOL) {
        sendData(client, new MLMessageGuiProtocol(33))
        sendData(client, new MLMessageToPassword(
            process.env.ML_DEV_USR,
            process.env.ML_DEV_PWD
        ))
    }
})

client.on('close', function () {
    logger.info('Connection closed')
})

function sendData(client: net.Socket, msg: MLMessageTo) {
    client.write(msg.toBuffer())
}

// src/server.ts
import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (message: string) => {
    console.log(`Received: ${message}`);
    ws.send(`You sent: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server listening on port 8080');
