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
 * Date:    2025.05.25
 */

import { MLMessageTypeTo, MLMsg } from "../msg/MLMsg"
import { MLMsgReader } from "../msg/MLMsgReader"

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

export class MLQueryNode extends MLMsg {
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
        return new MLQueryList(keywordQueries, MLQueryNodeType.T_AND)
    }

    public static fromBuffer(buffer: ArrayBuffer, offset: number): [MLQueryNode, number] {
        const reader = new MLMsgReader(buffer)
        const type = reader.readInt8(offset)
        offset += type[1]
        let ret
        switch (type[0]) {
        case MLQueryNodeType.T_AND:
        case MLQueryNodeType.T_OR:
        case MLQueryNodeType.T_ANDNOT:
        case MLQueryNodeType.T_HIDDEN:
            ret = MLQueryList.fromBuffer2(buffer, offset, type[0])
            break
        case MLQueryNodeType.T_MODULE:
            ret = MLQueryModule.fromBuffer(buffer, offset)
            break
        case MLQueryNodeType.T_MINSIZE:
        case MLQueryNodeType.T_MAXSIZE:
        case MLQueryNodeType.T_FORMAT:
        case MLQueryNodeType.T_MEDIA:
        case MLQueryNodeType.T_MP3_ARTIST:
        case MLQueryNodeType.T_MP3_TITLE:
        case MLQueryNodeType.T_MP3_ALBUM:
        case MLQueryNodeType.T_MP3_BITRATE:
            ret = MLCommentDefaultQuery.fromBuffer2(buffer, offset, type[0])
            break
        case MLQueryNodeType.T_KEYWORDS:
            ret = MLQueryKeywords.fromBuffer(buffer, offset)
            break
        }

        if (ret)
            return [ret[0], ret[1] + 1]

        throw new Error("Unsopported query type: " + type)
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

    public static override fromBuffer(buffer: ArrayBuffer, offset: number): [MLQueryKeywords, number] {
        const reader = new MLMsgReader(buffer)
        const [s1, c1] = reader.readString(offset)
        const [s2, c2] = reader.readString(offset + c1)
        return [new MLQueryKeywords(s1 + s2), c1 + c2]
    }
}

export class MLQueryList extends MLQueryNode {
    constructor(public queries: MLQueryNode[], type: MLQueryNodeType) {
        super(type)
    }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendInt8(ret, this.nodeType)
        ret = this.appendInt16(ret, this.queries.length)
        this.queries.forEach((q) => {
            ret = this.appendBuffer(ret, q.toBuffer())
        })

        return ret
    }

    public static fromBuffer2(buffer: ArrayBuffer, offset: number, type: MLQueryNodeType): [MLQueryNode, number] {
        const reader = new MLMsgReader(buffer)
        const queries = reader.readList(offset, (_buffer: ArrayBuffer, offset: number) =>
            MLQueryNode.fromBuffer(buffer, offset)
        )

        return [new MLQueryList(queries[0], type), queries[1]]
    }
}

export class MLQueryModule extends MLQueryNode {
    constructor(public name: string, public query: MLQueryNode) {
        super(MLQueryNodeType.T_MODULE)
    }

    public static override fromBuffer(buffer: ArrayBuffer, offset: number): [MLQueryModule, number] {
        const reader = new MLMsgReader(buffer, offset)
        const name = reader.readString(offset)
        const query = MLQueryNode.fromBuffer(buffer, offset + name[1])
        return [new MLQueryModule(name[0], query[0]), name[1] + query[1]]
    }
}

export class MLCommentDefaultQuery extends MLQueryNode {
    constructor(
        public comment: string,
        public def: string,
        type: MLQueryNodeType
    ) { super(type) }

    public static fromBuffer2(buffer: ArrayBuffer, offset: number, type: MLQueryNodeType): [MLQueryNode, number] {
        const reader = new MLMsgReader(buffer)
        const comment = reader.readString(offset)
        const def = reader.readString(offset + comment[1])
        return [new MLCommentDefaultQuery(comment[0], def[0], type), comment[1] + def[1]]
    }
}
