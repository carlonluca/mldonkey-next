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
 * Date:    2023.08.17
 */
import { MLMsgDownloadElement } from "../data/MLDownloadFileInfo"
import { MLMsgFrom, MLMessageTypeFrom, MLMsgTo, MLMessageTypeTo } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgFromDownloadFile extends MLMsgFrom {
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

export class MLMsgFromFileDownloaded extends MLMsgFrom {
    constructor(
        public downloadId: number,
        public downloaded: bigint,
        public speed: number,
        public lastseen: number | null
    ) {
        super(MLMessageTypeFrom.T_FILE_DOWNLOADED)
    }

    public static fromBuffer(buffer: ArrayBuffer, opcode: number): MLMsgFromFileDownloaded {
        const reader = new MLMsgReader(buffer)
        const downloadId = reader.takeInt32()
        const downloaded = reader.takeInt64()
        const speed = reader.takeDecimal()
        let lastseen = null
        if (opcode >= 46)
            lastseen = reader.takeInt32()
        return new MLMsgFromFileDownloaded(downloadId, downloaded, speed, lastseen)
    }
}

export enum MLDownloadMethod {
    M_TRY = 0,
    M_FORCE = 1
}

export class MLMsgToDownload extends MLMsgTo {
    constructor(
        public fileNames: string[],
        public resultId: number,
        public method: MLDownloadMethod
    ) {
        super(MLMessageTypeTo.T_DOWNLOAD_QUERY)
    }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendStringList(ret, this.fileNames)
        ret = this.appendInt32(ret, this.resultId)
        ret = this.appendInt8(ret, this.method)
        return this.createEnvelope(ret)
    }
}
