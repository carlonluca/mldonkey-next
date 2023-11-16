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
 * Date: 2023.11.15
 */
import { MLResultInfo } from "../data/MLResultInfo"
import { MLObservableVariable } from "./MLObservableVariable"
import { MLResultInfoManager } from "./MLResultInfoManager"
import { MLSearchInfoManager } from "./MLSearchInfoManager"
import { MLSearchResultManager } from "./MLSearchResultManager"

export class MLSearchSessionManager {
    public elements: MLObservableVariable<Array<MLResultInfo>> = new MLObservableVariable(new Array())

    constructor(
        private searchId: number,
        private searchManager: MLSearchInfoManager,
        private resultManager: MLResultInfoManager,
        private searchResultManager: MLSearchResultManager) {
        resultManager.elements.observable.subscribe(() => this.refresh())
        searchResultManager.searchResults.observable.subscribe(() => this.refresh())
    }

    public setSearchId(searchId: number) {
        this.searchId = searchId
        this.elements.value.splice(0, this.elements.value.length)
        this.elements.observable.next(this.elements.value)
    }

    private refresh() {
        const matches = this.searchResultManager.searchResults.value
        const resultIds = new Set<number>()
        matches.forEach((m) => {
            if (m.searchId === this.searchId)
                resultIds.add(m.resultId)
        })

        const results = this.resultManager.elements.value
        let modified = false
        resultIds.forEach((resultId) => {
            const res = results.get(resultId)
            if (res && this.elements.value.indexOf(res) < 0) {
                this.elements.value.push(res)
                modified = true
            }
        })

        if (modified)
            this.elements.observable.next(this.elements.value)
    }
}
