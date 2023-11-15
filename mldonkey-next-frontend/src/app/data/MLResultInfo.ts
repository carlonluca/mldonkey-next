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
 * Date: 2023.11.13
 */
import { MLUPdateable } from "../core/MLUpdateable"
import { MLUtils } from "../core/MLUtils"
import { MLMsgReader } from "../msg/MLMsgReader"
import { MLTag } from "../msg/MLtag"

export class MLResultInfo implements MLUPdateable<MLResultInfo> {
    constructor(
        public id: number,
        public networkId: number,  // seems to be hardcoded to 0
        public fileNames: string[],
        public fileIds: string[],
        public fileSize: bigint,
        public fileFormat: string,
        public fileType: string,
        public fileMetadata: Map<string, MLTag>,
        public comment: string,
        public alreadyDone: boolean,
        public time: number
    ) {}

    update(update: MLResultInfo): void {
        this.id = update.id
        this.networkId = update.networkId
        this.fileNames = update.fileNames
        this.fileIds = update.fileIds
        this.fileSize = update.fileSize
        this.fileFormat = update.fileFormat
        this.fileType = update.fileType
        this.fileMetadata = update.fileMetadata
        this.comment = update.comment
        this.alreadyDone = update.alreadyDone
        this.time = update.time
    }

    public static fromBuffer(data: ArrayBuffer, proto: number): MLResultInfo | undefined {
        const reader = new MLMsgReader(data)
        const id = reader.takeInt32()
        const networkId = reader.takeInt32()
        const names = reader.takeStringList()
        const uids = proto > 26 ? reader.takeStringList() : [
            "urn:ed2k:" + MLUtils.buf2hex(reader.takeMd4())
        ]
        const size = reader.takeInt64()
        const format = reader.takeString()
        const type = reader.takeString()
        const tags = new Map()
        for (let i = reader.takeInt16(); i >= 0; i--) {
            const tag = reader.takeTag()
            if (!tag)
                return undefined
            tags.set(tag.name, tag)
        }

        let comment = ""
        let alreadyDone = false
        let time = 0
        try {
            comment = reader.takeString()
            alreadyDone = (reader.takeInt8() > 0)
            time = proto > 26 ? reader.takeInt32() : 0
        }
        catch (e) {
            // No need to handle.
        }

        return new MLResultInfo(
            id,
            networkId,
            names,
            uids,
            size,
            format,
            type,
            tags,
            comment,
            alreadyDone,
            time
        )
    }
}
