/**
 * Supported messages.
 */
export enum MLMessageType {
    T_CORE_PROTOCOL = 0
}

export class MLMessage {
    public type: MLMessageType

    /**
     * Ctor.
     * 
     * @param type 
     */
    constructor(type: MLMessageType) {
        this.type = type
    }

    /**
     * Parses the buffer.
     * 
     * @param data 
     * @returns 
     */
    static processBuffer(buffer: Buffer): Buffer {
        const SIZE_HEADER = 6
        const SIZE_SIZE = 4
        const SIZE_OPCODE = 2

        if (buffer.length < SIZE_HEADER) {
            console.log("Insufficient data")
            return
        }

        const header = buffer.slice(0, SIZE_HEADER);
        console.log("HEADER:", header)

        const size = header.readInt32LE() - SIZE_OPCODE
        console.log("SIZE:", size)

        const opcode = header.readInt16LE(SIZE_SIZE)
        console.log("OPCODE:", opcode)

        if (opcode == -1 || size < 0) {
            console.warn("Malformed packet:", opcode, size)
            buffer.slice(6)
            return
        }

        if (buffer.length >= SIZE_HEADER + size - SIZE_OPCODE) {
            console.log("Full message received")
            if (opcode == MLMessageType.T_CORE_PROTOCOL)
                MLMessageCoreProtocol.fromBuffer(buffer.slice(4, size))
            return buffer.slice(SIZE_HEADER + size - SIZE_OPCODE)
        }
        else
            console.log("Insufficient data")
    }
}

/**
 * Represents the CoreProtocol message.
 */
export class MLMessageCoreProtocol extends MLMessage {
    public version: Number

    /**
     * Ctor.
     */
    constructor(version: Number) {
        super(MLMessageType.T_CORE_PROTOCOL)
        this.version = version
    }

    /**
     * Parses the message.
     * 
     * @param buffer 
     */
    static fromBuffer(buffer: Buffer): MLMessageCoreProtocol {
        return new MLMessageCoreProtocol(buffer.readInt32LE(2))
    }
}
