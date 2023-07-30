/**
 * Supported messages.
 */
export enum MLMessageTypeFrom {
    T_CORE_PROTOCOL = 0
}

/**
 * Represent a generic messago to or from the mlnet core.
 */
export abstract class MLMessage {
    public opcode: number

    /**
     * Ctor.
     * 
     * @param type 
     */
    constructor(opcode: number) {
        this.opcode = opcode
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
            if (opcode == MLMessageTypeFrom.T_CORE_PROTOCOL)
                MLMessageCoreProtocol.fromBuffer(buffer.slice(4, size))
            return buffer.slice(SIZE_HEADER + size - SIZE_OPCODE)
        }
        else
            console.log("Insufficient data")
    }

    public abstract toBuffer(): Buffer
}

/**
 * Represents the CoreProtocol message.
 */
export class MLMessageFrom extends MLMessage {
    public version: MLMessageTypeFrom

    /**
     * Ctor.
     */
    constructor(version: MLMessageTypeFrom) {
        super(MLMessageTypeFrom.T_CORE_PROTOCOL)
        this.version = version
    }

    /**
     * Not supposed to be sent to the server.
     * 
     * @returns 
     */
    public toBuffer(): Buffer {
        return null
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

export class MLMessageCoreProtocol extends MLMessageFrom {
    /**
     * Ctor.
     */
    constructor(version: MLMessageTypeFrom) {
        super(MLMessageTypeFrom.T_CORE_PROTOCOL)
        this.version = version
    }
}