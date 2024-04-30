/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2023 Luca Carlon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2023.08.15
 */
import {
    MLTag,
    MLTagIn16,
    MLTagIn8,
    MLTagInt32,
    MLTagInt32Pair,
    MLTagIp,
    MLTagString,
    MLTagType,
    MLTagUint32
} from "./MLtag"

export class MLBufferUtils {
    public static readRawData(buffer: ArrayBuffer, offset: number, length: number): [ArrayBuffer, number] {
        return [buffer.slice(offset, offset + length), length]
    }

    public static readByteArray(buffer: ArrayBuffer, offset: number): [ArrayBuffer, number] {
        let consumed = 0
        let [length] = this.readInt16(buffer, offset)
        consumed += 2
        if (length === 0xffff) {
            [length] = this.readInt32(buffer, offset)
            consumed += 4
        }
        const [ret] = this.readRawData(buffer, offset + consumed, length)
        return [ret, length + consumed]
    }

    public static readMd4(buffer: ArrayBuffer, offset: number): [ArrayBuffer, number] {
        return this.readRawData(buffer, offset, 16)
    }

    public static readString(buffer: ArrayBuffer, offset: number): [string, number] {
        const [data, consumed] = this.readByteArray(buffer, offset)
        const decoder = new TextDecoder("utf-8")
        const ret = decoder.decode(data)
        return [ret, consumed]
    }

    public static readStringList(buffer: ArrayBuffer, offset: number): [string[], number] {
        let consumed = 0
        const [size] = this.readInt16(buffer, offset)
        consumed += 2
        const ret: string[] = []
        for (let i = 0; i < size; i++) {
            const [s, consumedString] = this.readString(buffer, offset + consumed)
            consumed += consumedString
            ret.push(s)
        }

        return [ret, consumed]
    }

    public static readInt8(buffer: ArrayBuffer, offset: number): [number, number] {
        return [new DataView(buffer).getInt8(offset), 1]
    }

    public static readInt16(buffer: ArrayBuffer, offset: number): [number, number] {
        return [new DataView(buffer).getInt16(offset, true), 2]
    }

    public static readInt32(buffer: ArrayBuffer, offset: number): [number, number] {
        return [new DataView(buffer).getInt32(offset, true), 4]
    }

    public static readInt64(buffer: ArrayBuffer, offset: number): [bigint, number] {
        return [new DataView(buffer).getBigInt64(offset, true), 8]
    }

    public static readDecimal(buffer: ArrayBuffer, offset: number): [number, number] {
        /*const [data, consumed] = this.readByteArray(buffer, offset)
        if (data.byteLength <= 4)
            return [new DataView(data).getFloat32(0, true), consumed]
        else if (data.byteLength <= 8)
            return [new DataView(data).getFloat64(0, true), consumed]
        else {
            logger.warn("Could not read decimal of size", data.byteLength)
            return [0, consumed]
        }*/
        const [data, consumed] = this.readString(buffer, offset)
        return [parseFloat(data), consumed]
    }

    public static readDate(buffer: ArrayBuffer, offset: number): [number, number] {
        return [Math.round(Date.now() / 1000) - this.readInt32(buffer, offset)[0], 4]
    }

    public static readTag(data: ArrayBuffer, offset: number): [MLTag | undefined, number] {
        let consumed = 0
        const [name, consumedString] = this.readString(data, offset)
        consumed += consumedString
        const [type, consumedType] = this.readInt8(data, offset + consumed)
        consumed += consumedType
        switch (type) {
        case MLTagType.T_UINT32: {
            const [value, consumedValue] = this.readInt32(data, offset + consumed)
            return [new MLTagUint32(name, value), consumed + consumedValue]
        }
        case MLTagType.T_SINT32: {
            const [value, consumedValue] = this.readInt32(data, offset + consumed)
            return [new MLTagInt32(name, value), consumed + consumedValue]
        }
        case MLTagType.T_STRING: {
            const [value, consumedValue] = this.readString(data, offset + consumed)
            return [new MLTagString(name, value), consumed + consumedValue]
        }
        case MLTagType.T_IP: {
            const [value, consumedValue] = this.readInt32(data, offset + consumed)
            return [new MLTagIp(name, value), consumed + consumedValue]
        }
        case MLTagType.T_SINT16: {
            const [value, consumedValue] = this.readInt16(data, offset + consumed)
            return [new MLTagIn16(name, value), consumed + consumedValue]
        }
        case MLTagType.T_SINT8: {
            const [value, consumedValue] = this.readInt8(data, offset + consumed)
            return [new MLTagIn8(name, value), consumed + consumedValue]
        }
        case MLTagType.T_SINT32_PAIR: {
            const [value1, consumedValue1] = this.readInt32(data, offset + consumed)
            consumed += consumedValue1
            const [value2, consumedValue2] = this.readInt32(data, offset + consumed)
            consumed += consumedValue2
            return [new MLTagInt32Pair(name, value1, value2), consumed]
        }
        default:
            return [undefined, 0]
        }
    }
}

export class MLMsgReader {
    constructor(public data: ArrayBuffer, public offset: number = 0) {}

    readRawData(offset: number, length: number): [ArrayBuffer, number] {
        return MLBufferUtils.readRawData(this.data, offset, length)
    }

    readByteArray(offset: number): [ArrayBuffer, number] {
        return MLBufferUtils.readByteArray(this.data, offset)
    }

    readMd4(offset: number): [ArrayBuffer, number] {
        return MLBufferUtils.readMd4(this.data, offset)
    }

    readStringList(offset: number): [string[], number] {
        return MLBufferUtils.readStringList(this.data, offset)
    }

    readString(offset: number): [string, number] {
        return MLBufferUtils.readString(this.data, offset)
    }

    readInt8(offset: number): [number, number] {
        return MLBufferUtils.readInt8(this.data, offset)
    }

    readInt16(offset: number): [number, number] {
        return MLBufferUtils.readInt16(this.data, offset)
    }

    readInt32(offset: number): [number, number] {
        return MLBufferUtils.readInt32(this.data, offset)
    }

    readInt64(offset: number): [bigint, number] {
        return MLBufferUtils.readInt64(this.data, offset)
    }

    readDecimal(offset: number): [number, number] {
        return MLBufferUtils.readDecimal(this.data, offset)
    }

    readDate(offset: number): [number, number] {
        return MLBufferUtils.readDate(this.data, offset)
    }

    readTag(offset: number): [MLTag | undefined, number] {
        return MLBufferUtils.readTag(this.data, offset)
    }

    takeRawData(length: number): ArrayBuffer {
        const [ret, consumed] = this.readRawData(this.offset, length)
        this.offset += consumed
        return ret
    }

    takeByteArray(): ArrayBuffer {
        const [ret, consumed] = this.readByteArray(this.offset)
        this.offset += consumed
        return ret
    }

    takeMd4(): ArrayBuffer {
        const [ret, consumed] = this.readMd4(this.offset)
        this.offset += consumed
        return ret
    }

    takeStringList(): string[] {
        const [ret, consumed] = this.readStringList(this.offset)
        this.offset += consumed
        return ret
    }

    takeString(): string {
        const [ret, consumed] = this.readString(this.offset)
        this.offset += consumed
        return ret
    }

    takeInt8(): number {
        const [ret, consumed] = this.readInt8(this.offset)
        this.offset += consumed
        return ret
    }

    takeInt16(): number {
        const [ret, consumed] = this.readInt16(this.offset)
        this.offset += consumed
        return ret
    }

    takeInt32(): number {
        const [ret, consumed] = this.readInt32(this.offset)
        this.offset += consumed
        return ret
    }

    takeInt64(): bigint {
        const [ret, consumed] = this.readInt64(this.offset)
        this.offset += consumed
        return ret
    }

    takeDecimal(): number {
        const [ret, consumed] = this.readDecimal(this.offset)
        this.offset += consumed
        return ret
    }

    takeDate(): number {
        const [ret, consumed] = this.readDate(this.offset)
        this.offset += consumed
        return ret
    }

    takeTag(): MLTag | undefined {
        const [ret, consumed] = this.readTag(this.offset)
        this.offset += consumed
        return ret
    }
}
