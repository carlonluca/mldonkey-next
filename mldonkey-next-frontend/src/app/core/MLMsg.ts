import { logger } from './MLLogger'
import { MLMessageFromNetInfo } from './MLMsgNetInfo'
import { MLUtils } from './MLUtils'

/**
 * Supported messages.
 */
export enum MLMessageTypeFrom {
    T_NONE = -1,
    T_CORE_PROTOCOL = 0,
    T_NET_INFO = 20,
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
     * Parses the buffer. Returns a message if parsed successfully and the number
     * of consumed bytes.
     * 
     * @param data 
     * @returns 
     */
    static processBuffer(buffer: ArrayBuffer): [MLMessageFrom | null, number] {
        const SIZE_HEADER = 6
        const SIZE_SIZE = 4
        const SIZE_OPCODE = 2

        if (buffer.byteLength < SIZE_HEADER) {
            logger.debug("Insufficient data")
            return [null, 0]
        }

        const dataView = new DataView(buffer)
        const size = dataView.getInt32(0, true) - SIZE_OPCODE
        logger.debug(`<- Size: ${size} - ${MLUtils.buf2hex(buffer.slice(0, 4))}`)

        const opcode = dataView.getInt16(SIZE_SIZE, true)
        logger.debug(`<- Opcode: ${opcode}`)

        if (opcode == -1 || size < 0) {
            logger.warn(`Malformed packet: ${opcode} - ${size}`)
            buffer.slice(6)
            return [null, 0]
        }

        if (buffer.byteLength >= SIZE_HEADER + size) {
            logger.debug("Full message received:", MLUtils.buf2hex(buffer.slice(0, SIZE_HEADER + size)))
            buffer = buffer.slice(SIZE_HEADER)

            const data = buffer.slice(0, size)
            buffer = buffer.slice(size)
            logger.debug("Remaining buffer:", MLUtils.buf2hex(buffer))
            switch (opcode) {
            case MLMessageTypeFrom.T_CORE_PROTOCOL:
                return [MLMessageCoreProtocol.fromBuffer(data), size + SIZE_HEADER]
            case MLMessageTypeFrom.T_NET_INFO:
                return [MLMessageFromNetInfo.fromBuffer(data), size + SIZE_HEADER]
            case MLMessageTypeFrom.T_BAD_PASSWORD:
                return [new MLMessageBadPassword(), size + SIZE_HEADER]
            default:
                logger.warn(`Unknown msg with opcode: ${opcode}`)
                return [null, 0]
            }
        }
        else
            logger.debug("Insufficient data")

        return [null, 0]
    }

    /**
     * Embeds the buffer into a mldonkey envelope.
     * 
     * @param buffer 
     * @returns 
     */
    protected createEnvelope(buffer: ArrayBuffer): ArrayBuffer {
        let envelope = new ArrayBuffer(0)
        envelope = this.appendInt32(envelope, buffer.byteLength + 2)
        envelope = this.appendInt16(envelope, this.opcode)
        return MLUtils.concatArrayBuffers(envelope, buffer)
    }

    /**
     * Appends a string.
     * 
     * @param buffer 
     * @param s 
     */
    protected appendString(buffer: ArrayBuffer, s: string): ArrayBuffer {
        const sSize = s.length
        let ret = new ArrayBuffer(0)
        if (sSize >= 0xffff) {
            ret = this.appendInt16(ret, 0xffff)
            ret = this.appendInt32(ret, sSize)
        }
        else
            ret = this.appendInt16(ret, sSize)
        return MLUtils.concatArrayBuffers(buffer, ret, MLUtils.stringToUtf8ArrayBuffer(s))
    }

    /**
     * Appends a 16 bit integer.
     * 
     * @param buffer 
     * @param i 
     * @returns 
     */
    protected appendInt16(buffer: ArrayBuffer, i: number): ArrayBuffer {
        const tmpBuff = new DataView(new ArrayBuffer(2))
        tmpBuff.setInt16(0, i, true)
        return MLUtils.concatArrayBuffers(buffer, tmpBuff.buffer)
    }

    /**
     * Appends a 32 bit integer.
     * 
     * @param buffer 
     * @param i 
     * @returns 
     */
    protected appendInt32(buffer: ArrayBuffer, i: number): ArrayBuffer {
        const tmpBuff = new DataView(new ArrayBuffer(4))
        tmpBuff.setInt32(0, i, true)
        return MLUtils.concatArrayBuffers(buffer, tmpBuff.buffer)
    }

    protected static readString(buffer: ArrayBuffer, offset: number): [string, number] {
        let [size, consumed] = this.readInt16(buffer, offset)
        if (size == 0xffff) {
            [size, consumed] = this.readInt32(buffer, offset + consumed)
            consumed += 2
        }

        const decoder = new TextDecoder("iso-8859-1")
        const ret = decoder.decode(new DataView(buffer, offset + consumed, size))
        return [ret, consumed + size]
    }

    protected static readInt8(buffer: ArrayBuffer, offset: number): [number, number] {
        return [new DataView(buffer).getInt8(offset), 1]
    }

    protected static readInt16(buffer: ArrayBuffer, offset: number): [number, number] {
        return [new DataView(buffer).getInt16(offset, true), 2]
    }

    protected static readInt32(buffer: ArrayBuffer, offset: number): [number, number] {
        return [new DataView(buffer).getInt32(offset, true), 4]
    }

    protected static readInt64(buffer: ArrayBuffer, offset: number): [bigint, number] {
        return [new DataView(buffer).getBigInt64(offset, true), 8]
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
    public abstract toBuffer(): ArrayBuffer
}

export class MLMessageFromNone extends MLMessageFrom {
    constructor() { super(MLMessageTypeFrom.T_NONE) }
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

    public static fromBuffer(buffer: ArrayBuffer): MLMessageFrom {
        return new MLMessageCoreProtocol(new DataView(buffer).getInt32(2, true))
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
    public toBuffer(): ArrayBuffer {
        let ret = this.appendInt32(new ArrayBuffer(0), this.version)
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
    public toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendString(ret, this.passwd)
        ret = this.appendString(ret, this.user)
        return this.createEnvelope(ret)
    }
}
