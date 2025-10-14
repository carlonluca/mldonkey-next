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

/**
 * Author:  Luca Carlon
 * Company: -
 * Date:    2024.09.05
 */

import { MLMessageTypeFrom, MLMessageTypeTo, MLMsgFrom, MLMsgTo } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgToGetUploaders extends MLMsgTo {
    constructor() {
        super(MLMessageTypeTo.T_GET_UPLOADERS)
    }

    public override toBuffer(): ArrayBuffer {
        return this.createEnvelope(new ArrayBuffer(0))
    }
}

export class MLMsgFromUploaders extends MLMsgFrom {
    constructor(public clientNumbers: number[]) {
        super(MLMessageTypeFrom.T_UPLOAD_FILES)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromUploaders {
        const reader = new MLMsgReader(buffer)
        return new MLMsgFromUploaders(reader.takeInt32List())
    }
}
