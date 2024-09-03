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

import { MLMessageTypeFrom, MLMsgFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2024.09.01
 */

export class MLMsgFromClientStats extends MLMsgFrom {
    constructor(
        public totUploaded: bigint,
        public totDownloaded: bigint,
        public totShared: bigint,
        public countSharedFiles: number,
        public tcpUpSpeed: number,
        public tcpDownSpeed: number,
        public udpUpSpeed: number,
        public udpDownSpeed: number,
        public countDownloads: number,
        public countFinishedDownloads: number,
        public connectedServersPerNet: [number, number][]
    ) {
        super(MLMessageTypeFrom.T_CLIENT_STATS)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromClientStats {
        const reader = new MLMsgReader(buffer)
        const totUploaded = reader.takeInt64()
        const totDownloaded = reader.takeInt64()
        const totShared = reader.takeInt64()
        const countSharedFiles = reader.takeInt32()
        const tcpUpSpeed = reader.takeInt32()
        const tcpDownSpeed = reader.takeInt32()
        const udpUpSpeed = reader.takeInt32()
        const udpDownSpeed = reader.takeInt32()
        const countDownloads = reader.takeInt32()
        const countFinishedDownloads = reader.takeInt32()
        const connectedServersPerNet = reader.takeInt32PairList()
        return new MLMsgFromClientStats(
            totUploaded,
            totDownloaded,
            totShared,
            countSharedFiles,
            tcpUpSpeed,
            tcpDownSpeed,
            udpUpSpeed,
            udpDownSpeed,
            countDownloads,
            countFinishedDownloads,
            connectedServersPerNet
        )
    }
}
