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
 * Date: 2023.11.05
 */
import { MLResultInfo } from "../data/MLResultInfo"
import { MLSearchInfo, MLSearchType } from "../data/MLSearchInfo"
import { MLMessageTypeFrom, MLMessageTypeTo, MLMsgFrom, MLMsgTo } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgToQuery extends MLMsgTo {
    constructor(public searchNumber: number) { super(MLMessageTypeTo.T_SEARCH_QUERY) }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendInt32(ret, this.searchNumber)
        ret = this.appendInt8(ret, 4)                   // Operation
        //ret = this.appendInt16(ret, 2)
        ret = this.appendString(ret, "the")
        ret = this.appendString(ret, "offspring")
        ret = this.appendInt32(ret, 100)
        ret = this.appendInt8(ret, 1)    // Search type
        ret = this.appendInt32(ret, 0)   // Network
        return this.createEnvelope(ret)
    }
}

export class MLMsgToGetSearch extends MLMsgTo {
    constructor(public id: number) { super(MLMessageTypeTo.T_GET_SEARCH) }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendInt32(ret, this.id)
        return this.createEnvelope(ret)
    }
}

export class MLMsgToGetSearches extends MLMsgTo {
    constructor() { super(MLMessageTypeTo.T_GET_SEARCHES) }

    public override toBuffer(): ArrayBuffer {
        const ret = new ArrayBuffer(0)
        return this.createEnvelope(ret)
    }
}

export class MLMsgFromSearch extends MLMsgFrom {
    constructor(public content: MLSearchInfo) { super(MLMessageTypeFrom.T_SEARCH) }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFrom {
        const reader = new MLMsgReader(buffer)
        const content = new MLSearchInfo(
            reader.takeInt32(),
            reader.takeString(),
            reader.takeInt32(),
            reader.takeInt8() as MLSearchType,
            reader.takeInt32()
        )
        return new MLMsgFromSearch(content)
    }
}

export class MLMsgFromResultInfo extends MLMsgFrom {
    constructor(public content: MLResultInfo) { super(MLMessageTypeFrom.T_RESULT_INFO) }

    public static fromBuffer(buffer: ArrayBuffer, proto: number): MLMsgFromResultInfo | null {
        const resultInfo = MLResultInfo.fromBuffer(buffer, proto)
        if (!resultInfo)
            return null

        return new MLMsgFromResultInfo(resultInfo)
    }
}
