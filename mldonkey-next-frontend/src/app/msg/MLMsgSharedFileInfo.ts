/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2025 Luca Carlon
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
 * Date:    2025.02.24
 */

import { MLUPdateable } from "../core/MLUpdateable"
import { MLMessageTypeFrom, MLMsgFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgFromSharedFileInfo extends MLMsgFrom implements MLUPdateable<MLMsgFromSharedFileInfo> {
    constructor(
        public sharedFileId: number,
        public netId: number,
        public fileName: string,
        public fileSize: bigint,
        public uploadedBytes: bigint,
        public requestCount: number
    ) {
        super(MLMessageTypeFrom.T_SHARED_FILE_INFO)
    }

    update(update: MLMsgFromSharedFileInfo): void {
        this.sharedFileId = update.sharedFileId
        this.netId = update.netId
        this.fileName = update.fileName
        this.fileSize = update.fileSize
        this.uploadedBytes = update.uploadedBytes
        this.requestCount = update.requestCount
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromSharedFileInfo {
        const reader = new MLMsgReader(buffer)
        return new MLMsgFromSharedFileInfo(
            reader.takeInt32(),
            reader.takeInt32(),
            reader.takeString(),
            reader.takeInt64(),
            reader.takeInt64(),
            reader.takeInt32()
        )
    }
}
