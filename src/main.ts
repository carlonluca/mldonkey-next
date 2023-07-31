import * as net from 'net'
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
    console.log('CONNECTED TO: ' + HOST + ':' + PORT)
})

client.on('data', function (data: Buffer) {
    buffer = Buffer.concat([buffer, data])
    const msg = MLMessage.processBuffer(data)
    if (!msg)
        return
    console.info("Message received:", msg.type)
    if (msg.type == MLMessageTypeFrom.T_CORE_PROTOCOL) {
        //sendData(client, new MLMessageGuiProtocol(33))
        sendData(client, new MLMessageToPassword(
            process.env.ML_DEV_USR,
            process.env.ML_DEV_PWD
        ))
    }
})

client.on('close', function () {
    console.log('Connection closed')
})

function sendData(client: net.Socket, msg: MLMessageTo) {
    console.debug("-> ", msg.toBuffer().toString("hex"))
    client.write(msg.toBuffer())
}
