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
 * Date:    2025.05.23
 */

import { MLUPdateable } from "../core/MLUpdateable"
import { MLQueryNode } from "../data/MLSearchQuery"
import { MLMessageTypeFrom, MLMsgFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLDefinedSearch implements MLUPdateable<MLDefinedSearch> {
    constructor(
        public id: string,
        public query: MLQueryNode
    ) {}

    update(update: MLDefinedSearch): void {
        this.id = update.id
        this.query = update.query
    }
}

export class MLMsgFromDefinedSearches extends MLMsgFrom {
    constructor(
        public searches: MLDefinedSearch[]
    ) {
        super(MLMessageTypeFrom.T_DEFINE_SEARCHES)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromDefinedSearches {
        const reader = new MLMsgReader(buffer)
        const items = reader.takeList((buffer: ArrayBuffer, offset: number) => {
            const id = reader.readString(offset)
            const query = MLQueryNode.fromBuffer(buffer, offset + id[1])
            return [new MLDefinedSearch(id[0], query[0]), id[1] + query[1]]
        })
        return new MLMsgFromDefinedSearches(items)
    }
}
