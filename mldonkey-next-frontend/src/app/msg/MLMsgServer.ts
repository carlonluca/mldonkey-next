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
 * Date:    2025.01.03
 */

import { MLUPdateable } from "../core/MLUpdateable"
import { MLAddr } from "./MLAddr"
import { MLHostState } from "./MLHostState"
import { MLMessageTypeFrom, MLMsgFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"
import { MLTag } from "./MLTag"

export class MLMsgFromServerState extends MLMsgFrom implements MLUPdateable<MLMsgFromServerState> {
    constructor(
        public serverId: number,
        public hostState: MLHostState,
        msgType: MLMessageTypeFrom = MLMessageTypeFrom.T_SERVER_STATE
    ) {
        super(msgType)
    }

    update(update: MLMsgFromServerState): void {
        this.serverId = update.serverId
        this.hostState.update(update.hostState)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromServerState {
        const reader = new MLMsgReader(buffer)
        const serverId = reader.takeInt32()
        const hostState = reader.takeHostState()
        return new MLMsgFromServerState(serverId, hostState)
    }
}

export class MLMsgFromServerInfo extends MLMsgFromServerState implements MLUPdateable<MLMsgFromServerInfo> {
    constructor(
        serverId: number,
        public netId: number,
        public inetAddr: MLAddr | undefined,
        public serverPort: number,
        public serverScore: number,
        public serverMetadata: (MLTag | undefined)[],
        public userCount: bigint,
        public fileCount: bigint,
        hostState: MLHostState,
        public serverName: string,
        public serverDesc: string,
        public preferred: boolean,
        public serverVersion: string,
        public maxUsers: bigint,
        public lowIdUsers: bigint,
        public softLimit: bigint,
        public hardLimit: bigint,
        public ping: number
    ) {
        super(serverId, hostState, MLMessageTypeFrom.T_SERVER_INFO)
    }

    override update(update: MLMsgFromServerInfo): void {
        super.update(update)
        this.netId = update.netId
        if (update.inetAddr)
            this.inetAddr?.update(update.inetAddr)
        else
            this.inetAddr = undefined
        this.serverPort = update.serverPort
        this.serverScore = update.serverScore
        this.serverMetadata = update.serverMetadata // TODO: reimplement this
        this.userCount = update.userCount
        this.fileCount = update.fileCount
        this.serverName = update.serverName
        this.serverDesc = update.serverDesc
        this.preferred = update.preferred
        this.serverVersion = update.serverVersion
        this.maxUsers = update.maxUsers
        this.lowIdUsers = update.lowIdUsers
        this.softLimit = update.softLimit
        this.hardLimit = update.hardLimit
        this.ping = update.ping
    }

    public static override fromBuffer(buffer: ArrayBuffer): MLMsgFromServerInfo {
        const reader = new MLMsgReader(buffer)
        const serverId = reader.takeInt32()
        const netId = reader.takeInt32()
        const serverAddr = reader.takeAddr()
        const serverPort = reader.takeUint16()
        const serverScore = reader.takeInt32()
        const serverMetadata = reader.takeTagList()
        const userCount = reader.takeInt64()
        const fileCount = reader.takeInt64()
        const hostState = reader.takeHostState()
        const serverName = reader.takeString()
        const serverDesc = reader.takeString()
        const preferred = reader.takeInt8() !== 1
        const serverVersion = reader.takeString()
        const maxUsers = reader.takeInt64()
        const lowIdUsers = reader.takeInt64()
        const softLimit = reader.takeInt64()
        const hardLimit = reader.takeInt64()
        const ping = reader.takeInt32()
        return new MLMsgFromServerInfo(
            serverId,
            netId,
            serverAddr,
            serverPort,
            serverScore,
            serverMetadata,
            userCount,
            fileCount,
            hostState,
            serverName,
            serverDesc,
            preferred,
            serverVersion,
            maxUsers,
            lowIdUsers,
            softLimit,
            hardLimit,
            ping
        )
    }
}
