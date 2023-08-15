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
 * Date: 14.08.2023
 */

import { MLMessageFrom, MLMessageTypeFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"
import { MLUPdateable } from "./MLUpdateable"

export enum MLNetworkFlags {
    NetworkHasServers = 0x0001,
    NetworkHasRooms = 0x0002,
    NetworkHasMultinet = 0x0004,
    VirtualNetwork = 0x0008,
    NetworkHasSearch = 0x0010,
    NetworkHasChat = 0x0020,
    NetworkHasSupernodes = 0x0040,
    NetworkHasUpload = 0x0080
}

export class MLMessageFromNetInfo extends MLMessageFrom implements MLUPdateable<MLMessageFromNetInfo> {
    constructor(
        public netNum: number,
        public name: string,
        public enabled: boolean,
        public configFile: string,
        public uploaded: bigint,
        public downloaded: bigint,
        public connected: boolean,
        public flags: MLNetworkFlags
    ) {
        super(MLMessageTypeFrom.T_NETWORK_INFO)
    }

    public update(netInfo: MLMessageFromNetInfo) {
        this.netNum = netInfo.netNum
        this.name = netInfo.name
        this.enabled = netInfo.enabled
        this.configFile = netInfo.configFile
        this.uploaded = netInfo.uploaded
        this.downloaded = netInfo.downloaded
        this.connected = netInfo.connected
        this.flags = netInfo.flags
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMessageFrom {
        const reader = new MLMsgReader(buffer)
        const nn = reader.takeInt32()
        const name = reader.takeString()
        const enabled = reader.takeInt8()
        const configFile = reader.takeString()
        const uploaded = reader.takeInt64()
        const downloaded = reader.takeInt64()
        const connected = reader.takeInt8()
        const flagCount = reader.takeInt16()
        let flags = 0
        for (let i = 0; i < flagCount; i++) {
            const j = reader.takeInt16()
            flags |= (1 << j) as MLNetworkFlags
        }
        
        return new MLMessageFromNetInfo(nn, name, enabled != 0, configFile, uploaded, downloaded, connected != 0, flags as MLNetworkFlags)
    }
}
