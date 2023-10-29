/*
 * This file is part of mldonket-next.
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
 * Date: 2023.08.17
 */
import { MLMessageFrom, MLMessageTypeFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"
import { MLUPdateable } from "./MLUpdateable"

export enum MLMsgFromDownloadState {
    S_DOWNLOADING = 0,
    S_PAUSED,
    S_COMPLETE,
    S_SHARED,
    S_CANCELLED,
    S_NEW,
    S_ABORTED,
    S_QUEUED
}

export class MLMsgDownloadElement implements MLUPdateable<MLMsgDownloadElement> {
    constructor(
        public downloadId: number,
        public netId: number,
        public names: string[],
        public md4: ArrayBuffer,
        public size: bigint,
        public downloaded: bigint,
        public nlocations: number,
        public nclients: number,
        public state: MLMsgFromDownloadState,
        public abortedMsg: string|null,
        public chunks: ArrayBuffer,
        public availability: Map<number, ArrayBuffer>,
        public speed: number,
        public chunksAge: number[],
        public age: number,
        public format: number,
        public formatInfo: string,
        public name: string,
        public lastSeen: number,
        public priority: number,
        public comment: string,
        public uids: string[]
        ) { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    update(update: MLMsgDownloadElement): void {
        this.netId = update.netId
        this.names = [...update.names]
        this.md4 = update.md4
        this.size = update.size
        this.downloaded = update.downloaded
        this.nlocations = update.nlocations
        this.nclients = update.nclients
        this.state = update.state
        this.abortedMsg = update.abortedMsg
        this.chunks = update.chunks
        this.availability = update.availability
        this.speed = update.speed
        this.chunksAge = [...update.chunksAge]
        this.age = update.age
        this.format = update.format
        this.formatInfo = update.formatInfo
        this.name = update.name
        this.lastSeen = update.lastSeen
        this.priority = update.priority
        this.comment = update.comment
        this.uids = update.uids
    }

    public static fromReader(reader: MLMsgReader): MLMsgDownloadElement {
        const downloadId = reader.takeInt32()
        const netId = reader.takeInt32()
        const names = reader.takeStringList()
        const md4 = reader.takeMd4()
        const size = reader.takeInt64()
        const downloaded = reader.takeInt64()
        const nlocations = reader.takeInt32()
        const nclients = reader.takeInt32()
        const state = reader.takeInt8() as MLMsgFromDownloadState
        const abortedmsg = state == MLMsgFromDownloadState.S_ABORTED ? reader.takeString() : null
        const chunks = reader.takeByteArray()
        const availability = new Map<number, ArrayBuffer>()
        const availabilityCount = reader.takeInt16()
        for (let i = 0; i < availabilityCount; i++) {
            const net = reader.takeInt32()
            availability.set(net, reader.takeByteArray())
        }
        const speed = reader.takeDecimal()
        const chunksAge: number[] = []
        const chunksCount = reader.takeInt16()
        for (let i = 0; i < chunksCount; i++) {
            let age = reader.takeDate()
            if (age < 0)
                age = 0x7fffffff + age
            chunksAge.push(age)
        }
        let age = reader.takeDate()
        if (age < 0)
            age = 0x7fffffff + age
        const format = reader.takeInt8()
        let formatInfo = ""
        switch (format) {
            case 1: {
                const a = reader.takeString()
                const b = reader.takeString()
                formatInfo = `${a} ${b}`
                break
            }
            case 2: {
                const a = reader.takeString()
                const i = reader.takeInt32()
                const j = reader.takeInt32()
                const k = reader.takeInt32()
                const l = reader.takeInt32()
                formatInfo = `AVI ${a} ${i}x${j} ${(k/1000).toFixed(2)}fps rate ${l}`
                break
            }
            case 3: {
                const a = reader.takeString()
                const b = reader.takeString()
                const c = reader.takeString()
                const d = reader.takeString()
                reader.takeString()
                const f = reader.takeInt32()
                reader.takeInt32()
                formatInfo = `MP3 Ti:${a} Ar:${b} Al:${c} Yr:${d} Tr:${f}`
                break
            }
            case 4: {
                formatInfo = "Ogg"
                const streamCount = reader.takeInt16()
                for (let i = 0; i < streamCount; i++) {
                    const streamNo = reader.takeInt32()
                    const a = reader.takeInt8()
                    let streamType;
                    switch (a) {
                        case 0:
                            streamType = "Video"
                            break
                        case 1:
                            streamType = "Audio"
                            break
                        case 2:
                            streamType = "Text"
                            break
                        case 3:
                            streamType = "Index"
                            break
                        case 4:
                            streamType = "Vorbis"
                            break
                        case 5:
                            streamType = "Theora"
                            break
                        default:
                            streamType = "Unknown"
                            break
                    }
                    const tagCount = reader.takeInt16()
                    const tags: string[] = []
                    for (let i = 0; i < tagCount; i++) {
                        const type = reader.takeInt8()
                        switch (type) {
                            case 0:
                                tags.push(`Codec:${reader.takeString()}`)
                                break
                            case 1:
                                tags.push(`BPS:${reader.takeInt32()}`);
                                break
                            case 2:
                                tags.push(`Dur:${reader.takeInt32()}`)
                                break
                            case 3:
                                tags.push("Sub")
                                break
                            case 4:
                                tags.push("Index")
                                break
                            case 5:
                                tags.push(`AudCh:${reader.takeInt32()}`)
                                break
                            case 6:
                                tags.push(`SmpRt:${reader.takeDecimal()}`)
                                break
                            case 7:
                                tags.push(`BlkAl:${reader.takeInt32()}`)
                                break
                            case 8:
                                tags.push(`AvgBPS:${reader.takeDecimal()}`)
                                break
                            case 9:
                                tags.push(`VorbisVer:${reader.takeDecimal()}`)
                                break
                            case 10:
                                tags.push(`SmpRt:${reader.takeDecimal()}`)
                                break
                            case 11: {
                                const bitRates: string[] = []
                                const bitRateCount = reader.takeInt16()
                                for (let i = 0; i < bitRateCount; i++) {
                                    const rateType = reader.takeInt8()
                                    switch (rateType) {
                                        case 0:
                                            bitRates.push(`Max:${reader.takeDecimal()}`)
                                            break
                                        case 1:
                                            bitRates.push(`Nom:${reader.takeDecimal()}`)
                                            break
                                        case 2:
                                            bitRates.push(`Min:${reader.takeDecimal()}`)
                                            break
                                        default:
                                            break
                                    }
                                }
                                tags.push(`BitRate:${bitRates.join(",")}`)
                                break
                            }
                            case 12:
                                tags.push(`BlkSz0:${reader.takeInt32()}`)
                                break
                            case 13:
                                tags.push(`BlkSz1:${reader.takeInt32()}`)
                                break
                            case 14:
                                tags.push(`Wt:${reader.takeDecimal()}`)
                                break
                            case 15:
                                tags.push(`Ht:${reader.takeDecimal()}`)
                                break
                            case 16:
                                tags.push(`SmpRt:${reader.takeDecimal()}`)
                                break
                            case 17:
                                tags.push(`Aspect:${reader.takeDecimal()}`)
                                break
                            case 18: {
                                let cs: string
                                switch (reader.takeInt8()) {
                                    case 1:
                                        cs = "Rec470M"
                                        break
                                    case 2:
                                        cs = "Rec470BG"
                                        break
                                    default:
                                        cs = "Undef"
                                        break
                                }
                                tags.push(`CS:${cs}`)
                                break
                            }
                            case 19:
                                tags.push(`Qual:${reader.takeInt32()}`)
                                break
                            case 20:
                                tags.push(`AvgBPS:${reader.takeInt32()}`)
                                break
                            default:
                                break
                        }
                    }
                    formatInfo += ` ${streamNo}:${streamType} [${tags.join(" ")}]`
                }
            }
            break
        default:
            formatInfo = "Unknown format"
            break
        }

        const name = reader.takeString()
        const lastSeen = reader.takeInt32()
        let priority = reader.takeInt32()
        if (priority > 0x40000000)
            priority -= 0x80000000
        const comment = reader.takeString()
        // TODO: check protocol
        const uids = reader.takeStringList()
        return new MLMsgDownloadElement(
            downloadId,
            netId,
            names,
            md4,
            size,
            downloaded,
            nlocations,
            nclients,
            state,
            abortedmsg,
            chunks,
            availability,
            speed,
            chunksAge,
            age,
            format,
            formatInfo,
            name,
            lastSeen,
            priority,
            comment,
            uids
        )
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgDownloadElement {
        return this.fromReader(new MLMsgReader(buffer))
    }
}

export class MLMsgFromDownloadFile extends MLMessageFrom {
    constructor(public elements: Map<number, MLMsgDownloadElement>) {
        super(MLMessageTypeFrom.T_DOWNLOAD_FILES)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromDownloadFile {
        const reader = new MLMsgReader(buffer)
        const elementCount = reader.takeInt16()
        const elements: Map<number, MLMsgDownloadElement> = new Map()
        for (let i = 0; i < elementCount; i++) {
            const f = MLMsgDownloadElement.fromReader(reader)
            if (f)
                elements.set(f.downloadId, f)
        }

        return new MLMsgFromDownloadFile(elements)
    }
}

export class MLMsgFileDownloaded extends MLMessageFrom {
    constructor(
        public downloadId: number,
        public downloaded: bigint,
        public speed: number,
        public lastseen: number | null
    ) {
        super(MLMessageTypeFrom.T_FILE_DOWNLOADED)
    }

    public static fromBuffer(buffer: ArrayBuffer, opcode: number): MLMsgFileDownloaded {
        const reader = new MLMsgReader(buffer)
        const downloadId = reader.takeInt32()
        const downloaded = reader.takeInt64()
        const speed = reader.takeDecimal()
        let lastseen = null
        if (opcode >= 46)
            lastseen = reader.takeInt32()
        return new MLMsgFileDownloaded(downloadId, downloaded, speed, lastseen)
    }
}
