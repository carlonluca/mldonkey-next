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

import { MLUPdateable } from "../core/MLUpdateable";

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2023.11.13
 */
export enum MLSearchType {
    T_LOCAL,
    T_REMOTE,
    T_SUBSCRIBE
}

export class MLSearchInfo implements MLUPdateable<MLSearchInfo> {
    constructor(
        public id: number,
        public queryString: string,
        public maxHits: number,
        public searchType: MLSearchType,
        public networkId: number
    ) {}

    update(update: MLSearchInfo): void {
        this.id = update.id
        this.queryString = update.queryString
        this.maxHits = update.maxHits
        this.searchType = update.searchType
        this.networkId = update.networkId
    }
}
