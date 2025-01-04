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

import { wsLogger } from "../core/MLLogger"

export enum MLHostConnState {
    S_NOT_CONNECTED,
    S_CONNECTING,
    S_CONNECTED_INITIATING,
    S_CONNECTED_DOWNLOADING,
    S_CONNECTED,
    S_CONNECTED_AND_QUEUED,
    S_NEW_HOST,
    S_REMOVED_HOST,
    S_BLACKLISTED,
    S_NOT_CONNECTED_WAS_QUEUED,
    S_CONNECTED_AND_UNKNOWN
}

export class MLHostState {
    constructor(
        public connState: MLHostConnState,
        public rank: number /* present ONLY IF Connection State = 3 or 5 or 9 */
    ) {}

    public static connStateFromInt(i: number): MLHostConnState {
        switch (i) {
            case 0:
                return MLHostConnState.S_NOT_CONNECTED
            case 1:
                return MLHostConnState.S_CONNECTING
            case 2:
                return MLHostConnState.S_CONNECTED_INITIATING
            case 3:
                return MLHostConnState.S_CONNECTED_DOWNLOADING
            case 4:
                return MLHostConnState.S_CONNECTED
            case 5:
                return MLHostConnState.S_CONNECTED_AND_QUEUED
            case 6:
                return MLHostConnState.S_NEW_HOST
            case 7:
                return MLHostConnState.S_REMOVED_HOST
            case 8:
                return MLHostConnState.S_BLACKLISTED
            case 9:
                return MLHostConnState.S_NOT_CONNECTED
            case 10:
                return MLHostConnState.S_CONNECTED_AND_UNKNOWN
            default:
                wsLogger.warn(`Unknown connection state: ${i}`)
                return MLHostConnState.S_NOT_CONNECTED
        }
    }
}