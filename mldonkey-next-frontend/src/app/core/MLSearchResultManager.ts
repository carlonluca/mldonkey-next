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
import { MLSearchResult } from "../data/MLSearchResult"
import { MLMessageTypeFrom } from "../msg/MLMsg"
import { MLMsgFromSearchResult } from "../msg/MLMsgQuery"
import { WebSocketService } from "../websocket-service.service"
import { MLObservableVariable } from "./MLObservableVariable"

export class MLSearchResultManager {
    public searchResults: MLObservableVariable<Array<MLSearchResult>> = new MLObservableVariable(new Array())

    constructor(websocketService: WebSocketService) {
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type == MLMessageTypeFrom.T_SEARCH_RESULT) {
                this.searchResults.value.push((msg as MLMsgFromSearchResult).content)
                this.searchResults.observable.next(this.searchResults.value)
            }
        })
    }
}
