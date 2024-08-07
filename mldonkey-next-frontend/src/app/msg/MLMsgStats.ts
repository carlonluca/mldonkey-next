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

import { MLMessageTypeTo, MLMsgTo } from "./MLMsg";

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2024.07.30
 */

export class MLMsgGetStats extends MLMsgTo {
    constructor() { super(MLMessageTypeTo.T_GET_STATS) }

    public override toBuffer(): ArrayBuffer {
        let buffer = new ArrayBuffer(0)
        buffer = this.appendInt32(buffer, 0)
        return this.createEnvelope(buffer)
    }
}
