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
 * Date:    2025.10.07
 */

import { MLClientKind } from "./MLClientKind"
import { MLHostState } from "./MLHostState"
import { MLMessageTypeFrom, MLMsgFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"
import { MLTag } from "./MLTag"

export enum MLRelationType {
    R_T_SOURCE,
    R_T_FRIEND,
    R_T_BROWSED
}

export class MLMsgFromClientInfo extends MLMsgFrom {
    constructor(
        public clientId: number,
        public netId: number,
        public clientKind: MLClientKind,
        public hostState: MLHostState,
        public relationType: MLRelationType,
        public clientMetadata: (MLTag | undefined)[],
        public clientName: string,
        public clientRating: number,
        public clientSoftware: string,
        public downloaded: bigint,
        public uploaded: bigint,
        public uploadFileName: string,
        public connectTime: number,
        public emuleMod: string,
        public clientVersion: string,
        public suiVerified: number
    ) {
        super(MLMessageTypeFrom.T_CLIENT_INFO)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromClientInfo {
        const reader = new MLMsgReader(buffer)
        const clientId = reader.takeInt32()
        const netId = reader.takeInt32()
        const clientKind = reader.takeClientKind()
        const hostState = reader.takeHostState()
        const relationType = reader.takeInt8()
        const clientMetadata = reader.takeTagList()
        const clientName = reader.takeString()
        const clientRating = reader.takeInt32()
        const clientSoftware = reader.takeString()
        const downloaded = reader.takeInt64()
        const uploaded = reader.takeInt64()
        const uploadFileName = reader.takeString()
        const connectTime = reader.takeInt32()
        const emuleMod = reader.takeString()
        const clientVersion = reader.takeString()
        const suiVerified = reader.takeInt8()
        return new MLMsgFromClientInfo(
            clientId,
            netId,
            clientKind,
            hostState,
            relationType == 0 ? MLRelationType.R_T_SOURCE
            : relationType == 1 ? MLRelationType.R_T_FRIEND
            : MLRelationType.R_T_BROWSED,
            clientMetadata,
            clientName,
            clientRating,
            clientSoftware,
            downloaded,
            uploaded,
            uploadFileName,
            connectTime,
            emuleMod,
            clientVersion,
            suiVerified
        )
    }
}
