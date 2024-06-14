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

import { MLMessageTypeFrom, MLMessageTypeTo, MLMsgFrom, MLMsgTo } from "./MLMsg";
import { MLMsgReader } from "./MLMsgReader";

export class MLMsgToGetSysInfo extends MLMsgTo {
    constructor() { super(MLMessageTypeTo.T_GET_SYSINFO) }

    public override toBuffer(): ArrayBuffer {
        return this.createEnvelope(new ArrayBuffer(0))
    }
}

export class MLMsgFromSysInfo extends MLMsgFrom {
    constructor(public info: Map<string, string>) { super(MLMessageTypeFrom.T_SYSINFO) }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromSysInfo {
        const reader = new MLMsgReader(buffer)
        const size = reader.takeInt16()
        const elements: Map<string, string> = new Map()
        for (let i = 0; i < size; i++) {
            const id = reader.takeString()
            const value = reader.takeString()
            elements.set(id, value)
        }

        return new MLMsgFromSysInfo(elements)
    }
}
