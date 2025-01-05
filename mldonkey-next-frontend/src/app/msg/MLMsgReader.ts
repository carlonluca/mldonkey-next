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

import { MLNumPair, MLNumPairList, MLStringPairList } from "../core/MLUtils"
import { MLFileComment } from "./MLFileComment"
import { MLSubFile } from "./MLSubFile"
import { MLAddr, MLAddrIp, MLAddrName, MLAddrType } from "./MLAddr"
import { MLHostConnState, MLHostState } from "./MLHostState"
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
} from "./MLTag"

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

    public static readList<T>(buffer: ArrayBuffer, offset: number, parseItem: (buffer: ArrayBuffer, offset: number) => [T, number]): [Array<T>, number] {
        let consumed = 0
        const [size] = this.readInt16(buffer, offset)
        consumed += 2
        const ret: Array<T> = []
        for (let i = 0; i < size; i++) {
            const [element, consumedElement] = parseItem(buffer, offset + consumed)
            consumed += consumedElement
            ret.push(element)
        }

        return [ret, consumed]
    }

    public static readStringList(buffer: ArrayBuffer, offset: number): [string[], number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) =>
            this.readString(buffer, offset)
        )
    }

    public static readStringPairList(buffer: ArrayBuffer, offset: number): [MLStringPairList, number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) => {
            let consumed = 0
            const [s1, consumedString1] = this.readString(buffer, offset)
            consumed += consumedString1
            const [s2, consumedString2] = this.readString(buffer, offset + consumed)
            consumed += consumedString2
            return [[s1, s2], consumed]
        })
    }

    public static readInt32PairList(buffer: ArrayBuffer, offset: number): [MLNumPairList, number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) => {
            let consumed = 0
            const [e1, consumed1] = this.readInt32(buffer, offset)
            consumed += consumed1
            const [e2, consumed2] = this.readInt32(buffer, offset + consumed)
            consumed += consumed2
            return [[e1, e2], consumed]
        })
    }

    public static readDecimalList(buffer: ArrayBuffer, offset: number): [number[], number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) => {
            return this.readDecimal(buffer, offset)
        })
    }

    public static readTagList(buffer: ArrayBuffer, offset: number): [(MLTag | undefined)[], number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) => {
            return this.readTag(buffer, offset)
        })
    }

    public static readSubFileList(buffer: ArrayBuffer, offset: number): [MLSubFile[], number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) => {
            return this.readSubFile(buffer, offset)
        })
    }

    public static readFileCommentList(buffer: ArrayBuffer, offset: number): [MLFileComment[], number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) => {
            return this.readFileComment(buffer, offset)
        })
    }

    public static readInt8(buffer: ArrayBuffer, offset: number): MLNumPair {
        return [new DataView(buffer).getInt8(offset), 1]
    }

    public static readInt16(buffer: ArrayBuffer, offset: number): MLNumPair {
        return [new DataView(buffer).getInt16(offset, true), 2]
    }

    public static readUint16(buffer: ArrayBuffer, offset: number): MLNumPair {
        return [new DataView(buffer).getUint16(offset, true), 2]
    }

    public static readInt32(buffer: ArrayBuffer, offset: number): MLNumPair {
        return [new DataView(buffer).getInt32(offset, true), 4]
    }

    public static readInt32List(buffer: ArrayBuffer, offset: number): [number[], number] {
        return this.readList(buffer, offset, (buffer: ArrayBuffer, offset: number) => {
            return this.readInt32(buffer, offset)
        })
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

    public static readAddr(buffer: ArrayBuffer, offset: number): [MLAddr | undefined, number] {
        let consumed = 0
        const [addrType, consumedAddrType] = this.readInt8(buffer, offset)
        consumed += consumedAddrType
        const addrTypeEnum = MLAddr.addrTypeFromInt(addrType)
        if (addrTypeEnum === MLAddrType.A_T_IP) {
            const [addrIp, consumedAddrIp] = this.readInt32(buffer, offset + consumed)
            consumed += consumedAddrIp
            const [geoIp, consumedGeoIp] = this.readInt8(buffer, offset + consumed)
            consumed += consumedGeoIp
            const [blocked, consumedBlocked] = this.readInt8(buffer, offset + consumed)
            consumed += consumedBlocked
            return [new MLAddrIp(geoIp, blocked, addrIp), consumed]
        }
        else {
            const [geoIp, consumedGeoIp] = this.readInt8(buffer, offset + consumed)
            consumed += consumedGeoIp
            const [nameAddr, consumedNameAddr] = this.readString(buffer, offset + consumed)
            consumed += consumedNameAddr
            const [blocked, consumedBlocked] = this.readInt8(buffer, offset + consumed)
            consumed += consumedBlocked
            return [new MLAddrName(geoIp, blocked, nameAddr), consumed]
        }
    }

    public static readHostState(buffer: ArrayBuffer, offset: number): [MLHostState | undefined, number] {
        let consumed = 0
        const [connState, consumedConnState] = this.readInt8(buffer, offset)
        consumed += consumedConnState

        let rank = 0
        let consumedRank = 0
        switch (connState) {
            case MLHostConnState.S_CONNECTED_DOWNLOADING:
            case MLHostConnState.S_CONNECTED_AND_QUEUED:
            case MLHostConnState.S_NOT_CONNECTED_WAS_QUEUED:
                [rank, consumedRank] = this.readInt32(buffer, offset)
                consumed += consumedRank
                break
        }
        
        return [new MLHostState(connState, rank), consumed]
    }

    public static readSubFile(data: ArrayBuffer, offset: number): [MLSubFile, number] {
        let consumed = 0
        const [name, consumedName] = this.readString(data, offset)
        consumed += consumedName
        const [size, consumedSize] = this.readInt64(data, offset + consumed)
        consumed += consumedSize
        const [format, consumedFormat] = this.readString(data, offset + consumed)
        consumed += consumedFormat
        return [
            new MLSubFile(name, size, format),
            consumed
        ]
    }

    public static readFileComment(data: ArrayBuffer, offset: number): [MLFileComment, number] {
        let consumed = 0
        const [ip, consumedIp] = this.readInt32(data, offset)
        consumed += consumedIp
        const [countryCode, consumedCc] = this.readInt8(data, offset + consumed)
        consumed += consumedCc
        const [name, consumedName] = this.readString(data, offset + consumed)
        consumed += consumedName
        const [rating, consumedRating] = this.readInt8(data, offset + consumed)
        consumed += consumedRating
        const [comment, consumedComment] = this.readString(data, offset + consumed)
        consumed += consumedComment
        return [
            new MLFileComment(ip, countryCode, name, rating, comment),
            consumed
        ]
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

    readList<T>(offset: number, parseItem: (buffer: ArrayBuffer, offset: number) => [T, number]): [T[], number] {
        return MLBufferUtils.readList(this.data, offset, parseItem)
    }

    readStringList(offset: number): [string[], number] {
        return MLBufferUtils.readStringList(this.data, offset)
    }

    readSubFileList(offset: number): [MLSubFile[], number] {
        return MLBufferUtils.readSubFileList(this.data, offset)
    }

    readFileCommentList(offset: number): [MLFileComment[], number] {
        return MLBufferUtils.readFileCommentList(this.data, offset)
    }

    readStringPairList(offset: number): [MLStringPairList, number] {
        return MLBufferUtils.readStringPairList(this.data, offset)
    }

    readInt32List(offset: number): [number[], number] {
        return MLBufferUtils.readInt32List(this.data, offset)
    }

    readInt32PairList(offset: number): [MLNumPairList, number] {
        return MLBufferUtils.readInt32PairList(this.data, offset)
    }

    readDecimalList(offset: number): [number[], number] {
        return MLBufferUtils.readDecimalList(this.data, offset)
    }

    readTagList(offset: number): [(MLTag | undefined)[], number] {
        return MLBufferUtils.readTagList(this.data, offset)
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

    readUint16(offset: number): MLNumPair {
        return MLBufferUtils.readUint16(this.data, offset)
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

    readAddr(offset: number): [MLAddr | undefined, number] {
        return MLBufferUtils.readAddr(this.data, offset)
    }

    readHostState(offset: number): [MLHostState | undefined, number] {
        return MLBufferUtils.readHostState(this.data, offset)
    }

    readSubFile(offset: number): [MLSubFile, number] {
        return MLBufferUtils.readSubFile(this.data, offset)
    }

    readFileComment(offset: number): [MLFileComment, number] {
        return MLBufferUtils.readFileComment(this.data, offset)
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

    takeList<T>(parseItem: (buffer: ArrayBuffer, offset: number) => [T, number]): T[] {
        const [ret, consumed] = this.readList<T>(this.offset, parseItem)
        this.offset += consumed
        return ret
    }

    takeStringList(): string[] {
        const [ret, consumed] = this.readStringList(this.offset)
        this.offset += consumed
        return ret
    }

    takeStringPairList(): MLStringPairList {
        const [ret, consumed] = this.readStringPairList(this.offset)
        this.offset += consumed
        return ret
    }

    takeInt32List(): number[] {
        const [ret, consumed] = this.readInt32List(this.offset)
        this.offset += consumed
        return ret
    }

    takeInt32PairList(): [number, number][] {
        const [ret, consumed] = this.readInt32PairList(this.offset)
        this.offset += consumed
        return ret
    }

    takeDecimalList(): number[] {
        const [ret, consumed] = this.readDecimalList(this.offset)
        this.offset += consumed
        return ret
    }

    takeTagList(): (MLTag | undefined)[] {
        const [ret, consumed] = this.readTagList(this.offset)
        this.offset += consumed
        return ret
    }

    takeSubFileList(): MLSubFile[] {
        const [ret, consumed] = this.readSubFileList(this.offset)
        this.offset += consumed
        return ret
    }

    takeFileCommentList(): MLFileComment[] {
        const [ret, consumed] = this.readFileCommentList(this.offset)
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

    takeUint16(): number {
        const [ret, consumed] = this.readUint16(this.offset)
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

    takeAddr(): MLAddr | undefined {
        const [ret, consumed] = this.readAddr(this.offset)
        this.offset += consumed
        return ret
    }

    takeHostState(): MLHostState | undefined {
        const [ret, consumed] = this.readHostState(this.offset)
        this.offset += consumed
        return ret
    }
}
