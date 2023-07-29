import * as net from 'net'
import { MLMessage } from './data/MLMessage'

const HOST = '192.168.0.2'
const PORT = 4001
let buffer = Buffer.alloc(0);

const client = new net.Socket();
client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT)
})

client.on('data', function (data: Buffer) {
    buffer = Buffer.concat([buffer, data])
    MLMessage.processBuffer(data)
})

client.on('close', function () {
    console.log('Connection closed')
})
