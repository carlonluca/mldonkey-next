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
import { searchLogger } from "../core/MLLogger"
import { MLResultInfo } from "../data/MLResultInfo"
import { MLSearchInfo, MLSearchType } from "../data/MLSearchInfo"
import { MLSearchResult } from "../data/MLSearchResult"
import { MLMessageTypeFrom, MLMessageTypeTo, MLMsgFrom, MLMsgTo } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export enum MLQueryNodeType {
    T_AND = 0,
    T_OR,
    T_ANDNOT,
    T_MODULE,
    T_KEYWORDS,
    T_MINSIZE,
    T_MAXSIZE,
    T_FORMAT,
    T_MEDIA,
    T_MP3_ARTIST,
    T_MP3_TITLE,
    T_MP3_ALBUM,
    T_MP3_BITRATE,
    T_HIDDEN
}

export class MLQueryNode extends MLMsgTo {
    constructor(public nodeType: MLQueryNodeType) { super(MLMessageTypeTo.T_NONE) }
    toBuffer(): ArrayBuffer { return new ArrayBuffer(0) }

    /**
     * Creates a query from a multiword string.
     * 
     * @param s 
     * @returns 
     */
    public static fromString(s: string): MLQueryNode | null {
        const tokens = s.trim().split(' ')
        if (tokens.length <= 0)
            return null
        if (tokens.length === 1)
            return new MLQueryKeywords(tokens[0])
        
        const keywordQueries: MLQueryNode[] = []
        tokens.forEach((t) => {
            if (t)
                keywordQueries.push(new MLQueryKeywords(t))
        })
        return new MLQueryAnd(keywordQueries)
    }
}

export class MLQueryKeywords extends MLQueryNode {
    constructor(public keyword: string) {
        super(MLQueryNodeType.T_KEYWORDS)
    }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendInt8(ret, MLQueryNodeType.T_KEYWORDS)
        ret = this.appendString(ret, "keyword")
        ret = this.appendString(ret, this.keyword)
        return ret
    }
}

export class MLQueryAnd extends MLQueryNode {
    constructor(public queryies: MLQueryNode[]) {
        super(MLQueryNodeType.T_AND)
    }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendInt8(ret, this.nodeType)
        ret = this.appendInt16(ret, this.queryies.length)
        this.queryies.forEach((q) => {
            ret = this.appendBuffer(ret, q.toBuffer())
        })

        return ret
    }
}

export class MLMsgToQuery extends MLMsgTo {
    constructor(public searchNumber: number, public query: MLQueryNode) { super(MLMessageTypeTo.T_SEARCH_QUERY) }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendInt32(ret, this.searchNumber)
        ret = this.appendBuffer(ret, this.query.toBuffer())
        ret = this.appendInt32(ret, 100)
        ret = this.appendInt8(ret, 1)                   // Search type
        ret = this.appendInt32(ret, 0)                  // Network
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

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromSearch {
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

export class MLMsgFromSearchResult extends MLMsgFrom {
    constructor(public content: MLSearchResult) { super(MLMessageTypeFrom.T_SEARCH_RESULT) }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromSearchResult {
        const reader = new MLMsgReader(buffer, 0)
        const searchId = reader.takeInt32()
        const resultId = reader.takeInt32()
        searchLogger.trace("Search result mapping received, searchId -> resultId",
            searchId, "->", resultId)
        return new MLMsgFromSearchResult(new MLSearchResult(resultId, searchId))
    }
}
