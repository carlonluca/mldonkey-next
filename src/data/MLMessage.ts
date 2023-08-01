/**
 * Supported messages.
 */
export enum MLMessageTypeFrom {
    T_CORE_PROTOCOL = 0,
    T_BAD_PASSWORD = 47
}

export enum MLMessageTypeTo {
    T_GUI_PROTOCOL = 0,
    T_PASSWORD = 52
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
    static processBuffer(buffer: Buffer): MLMessageFrom {
        const SIZE_HEADER = 6
        const SIZE_SIZE = 4
        const SIZE_OPCODE = 2

        if (buffer.length < SIZE_HEADER) {
            console.log("Insufficient data")
            return
        }

        const header = buffer.slice(0, SIZE_HEADER);
        const size = header.readInt32LE() - SIZE_OPCODE
        console.log("<- Size:", size)

        const opcode = header.readInt16LE(SIZE_SIZE)
        console.log("<- Opcode:", opcode)

        if (opcode == -1 || size < 0) {
            console.warn("Malformed packet:", opcode, size)
            buffer.slice(6)
            return
        }

        if (buffer.length >= SIZE_HEADER + size - SIZE_OPCODE) {
            console.log("Full message received")
            switch (opcode) {
            case MLMessageTypeFrom.T_CORE_PROTOCOL:
                return MLMessageCoreProtocol.fromBuffer(buffer.slice(4, size))
            case MLMessageTypeFrom.T_BAD_PASSWORD:
                return new MLMessageBadPassword()
            default:
                console.warn("Unknown msg with opcode", opcode)
                return null
            }
        }
        else
            console.log("Insufficient data")

        return null
    }

    /**
     * Embeds the buffer into a mldonkey envelope.
     * 
     * @param buffer 
     * @returns 
     */
    protected createEnvelope(buffer: Buffer): Buffer {
        let envelope = Buffer.alloc(0)
        envelope = this.appendInt32(envelope, buffer.length + 2)
        envelope = this.appendInt16(envelope, this.opcode)
        return Buffer.concat([ envelope, buffer ])
    }

    /**
     * Appends a string.
     * 
     * @param buffer 
     * @param s 
     */
    protected appendString(buffer: Buffer, s: string): Buffer {
        const sSize = s.length
        let ret = Buffer.alloc(0)
        if (sSize >= 0xffff) {
            ret = this.appendInt16(ret, 0xffff)
            ret = this.appendInt32(ret, sSize)
        }
        else
            ret = this.appendInt16(ret, sSize)
        return Buffer.concat([buffer, ret, Buffer.alloc(s.length, s)])
    }

    /**
     * Appends a 16 bit integer.
     * 
     * @param buffer 
     * @param i 
     * @returns 
     */
    protected appendInt16(buffer: Buffer, i: number): Buffer {
        const tmpBuff = Buffer.alloc(2)
        tmpBuff.writeInt16LE(i)
        return Buffer.concat([buffer, tmpBuff])
    }

    /**
     * Appends a 32 bit integer.
     * 
     * @param buffer 
     * @param i 
     * @returns 
     */
    protected appendInt32(buffer: Buffer, i: number): Buffer {
        const tmpBuff = Buffer.alloc(4)
        tmpBuff.writeInt32LE(i)
        return Buffer.concat([tmpBuff, buffer])
    }
}

/**
 * Represents the CoreProtocol message.
 */
export abstract class MLMessageFrom extends MLMessage {
    public type: MLMessageTypeFrom

    /**
     * Ctor.
     */
    constructor(type: MLMessageTypeFrom) {
        super(type)
        this.type = type
    }
}

export abstract class MLMessageTo extends MLMessage {
    public type: MLMessageTypeTo

    /**
     * Ctor.
     */
    constructor(type: MLMessageTypeTo) {
        super(type)
        this.type = type
    }

    /**
     * Not supposed to be sent to the server.
     * 
     * @returns 
     */
    public abstract toBuffer(): Buffer
}

/**
 * Core protocol message.
 */
export class MLMessageCoreProtocol extends MLMessageFrom {
    public version: number

    /**
     * Ctor.
     */
    constructor(version: number) {
        super(MLMessageTypeFrom.T_CORE_PROTOCOL)
        this.version = version
    }

    public static fromBuffer(buffer: Buffer): MLMessageFrom {
        return new MLMessageCoreProtocol(buffer.readInt32LE(2))
    }
}

/**
 * Bad password message.
 */
export class MLMessageBadPassword extends MLMessageFrom {
    constructor() { super(MLMessageTypeFrom.T_BAD_PASSWORD) }
}

export class MLMessageGuiProtocol extends MLMessageTo {
    public version: number
    constructor(version: number) {
        super(MLMessageTypeTo.T_GUI_PROTOCOL)
        this.version = version
    }
    public toBuffer(): Buffer {
        let ret = this.appendInt32(Buffer.alloc(0), this.version)
        ret = this.createEnvelope(ret)
        return ret
    }
}

/**
 * Represents the Password message.
 */
export class MLMessageToPassword extends MLMessageTo {
    public user: string
    public passwd: string

    /**
     * Ctor.
     * 
     * @param user
     * @param passwd 
     */
    constructor(user: string, passwd: string) {
        super(MLMessageTypeTo.T_PASSWORD)
        this.user = user
        this.passwd = passwd
    }

    /**
     * Serialize.
     */
    public toBuffer(): Buffer {
        let ret = Buffer.alloc(0)
        ret = this.appendString(ret, this.passwd)
        ret = this.appendString(ret, this.user)
        return this.createEnvelope(ret)
    }
}
