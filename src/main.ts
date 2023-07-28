import * as net from 'net'

const HOST = '192.168.0.2'
const PORT = 4001
let buffer = Buffer.alloc(0);

const client = new net.Socket();
client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT)
})

client.on('data', function (data: Buffer) {
    const SIZE_HEADER = 6
    const SIZE_SIZE = 4
    const SIZE_OPCODE = 2

    buffer = Buffer.concat([ buffer, data ])
    if (buffer.length < SIZE_HEADER) {
        console.log("Insufficient data")
        return
    }

    const header = data.slice(0, SIZE_HEADER);
    console.log("HEADER:", header)

    const size = header.readInt32LE() - SIZE_OPCODE
    console.log("SIZE:", size)

    const opcode = header.readInt16LE(SIZE_SIZE)
    console.log("OPCODE:", opcode)

    if (opcode == -1 || size < 0) {
        console.warn("Malformed packet:", opcode, size)
        return;
    }

    if (buffer.length >= SIZE_HEADER + size - SIZE_OPCODE) {
        console.log("Full message received");
        processMessageData(buffer.slice(4, size))
        return
    }
})

client.on('close', function () {
    console.log('Connection closed')
})

function processMessageData(data: Buffer) {
    console.log("Opcode:", data.readInt16LE())
    console.log("DATA:", data.length, data.readInt32LE(2))
}
