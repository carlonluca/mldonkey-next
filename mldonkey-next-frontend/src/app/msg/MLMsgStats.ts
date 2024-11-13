/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2024 Luca Carlon
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
 * Date: 2024.07.30
 */

import { MLUPdateable } from "../core/MLUpdateable"
import { MLMessageTypeFrom, MLMessageTypeTo, MLMsgFrom, MLMsgTo } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgToGetStats extends MLMsgTo {
    constructor(public networkId: number) { super(MLMessageTypeTo.T_GET_STATS) }

    public override toBuffer(): ArrayBuffer {
        let buffer = new ArrayBuffer(0)
        buffer = this.appendInt32(buffer, this.networkId)
        return this.createEnvelope(buffer)
    }
}

export class MLClientStat implements MLUPdateable<MLClientStat> {
    constructor(
        public clientDescriptionLong: string,
        public clientDescriptionShort: string,
        public seenSecs: number,
        public banned: number,
        public requests: number,
        public downloaded: bigint,
        public uploaded: bigint) {}

    update(update: MLClientStat): void {
        this.clientDescriptionLong = update.clientDescriptionLong
        this.clientDescriptionShort = update.clientDescriptionShort
        this.seenSecs = update.seenSecs
        this.banned = update.banned
        this.requests = update.requests
        this.downloaded = update.downloaded
        this.uploaded = update.uploaded
    }
}

export class MLSessionStatSet {
    constructor(
        public name: string,
        public uptime: number,
        public stats: MLClientStat[]
    ) {}
}

export class MLMsgFromStats extends MLMsgFrom {
    constructor(public networkId: number, public stats: MLSessionStatSet[]) {
        super(MLMessageTypeFrom.T_STATS)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromStats {
        const reader = new MLMsgReader(buffer)
        const networkId = reader.takeInt32()
        const statElements = reader.takeList((_buffer: ArrayBuffer, offset: number) => {
            let consumed = 0
            // The name is the name of the set of stats: "global clients" or "session clients".
            const [name, consumed1] = reader.readString(offset)
            consumed += consumed1
            // Uptime of this stat set.
            const [uptime, consumed2] = reader.readInt32(offset + consumed1)
            consumed += consumed2
            // Stats per client type.
            const [stats, consumed3] = reader.readList(offset + consumed1 + consumed2, (buffer2: ArrayBuffer, offset2: number) => {
                let consumed = 0
                const [clientDescriptionLong, consumed4] = reader.readString(offset2)
                consumed += consumed4
                const [clientDescriptionShort, consumed5] = reader.readString(offset2 + consumed)
                consumed += consumed5
                const [seenSecs, consumed6] = reader.readInt32(offset2 + consumed)
                consumed += consumed6
                const [banned, consumed7] = reader.readInt32(offset2 + consumed)
                consumed += consumed7
                const [requests, consumed8] = reader.readInt32(offset2 + consumed)
                consumed += consumed8
                const [downloaded, consumed9] = reader.readInt64(offset2 + consumed)
                consumed += consumed9
                const [uploaded, consumed10] = reader.readInt64(offset2 + consumed)
                consumed += consumed10
                return [new MLClientStat(
                    clientDescriptionLong,
                    clientDescriptionShort,
                    seenSecs,
                    banned,
                    requests,
                    downloaded,
                    uploaded
                ), consumed]
            })
            consumed += consumed3
            return [new MLSessionStatSet(name, uptime, stats), consumed]
        })
        return new MLMsgFromStats(networkId, statElements)
    }
}
