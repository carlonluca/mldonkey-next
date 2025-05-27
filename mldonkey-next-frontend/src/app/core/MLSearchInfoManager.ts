/*
 * This file is part of mldonkey-next.
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
 * Date:    2023.11.15
 */

import { interval, Subscription } from "rxjs"
import { MLSearchInfo } from "../data/MLSearchInfo"
import { MLMessageTypeFrom } from "../msg/MLMsg"
import { MLMsgFromSearch, MLMsgToGetSearches } from "../msg/MLMsgQuery"
import { WebSocketService } from "../websocket-service.service"
import { MLCollectionModel } from "./MLCollectionModel"

export class MLSearchInfoManager extends MLCollectionModel<number, MLSearchInfo> {
    private timer: Subscription | null = null
    private listeners: number = 0

    constructor(private websocketService: WebSocketService) {
        super()
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type == MLMessageTypeFrom.T_SEARCH) {
                this.handleValue((msg as MLMsgFromSearch).content)
            }
        })

        // Refresh
        websocketService.sendMsg(new MLMsgToGetSearches())
    }

    protected override keyFromValue(value: MLSearchInfo): number {
        return value.id
    }

    public registerListener() {
        this.listeners++
        if (this.listeners >= 1)
            this.start()
    }

    public unregisterListener() {
        this.listeners--
        if (this.listeners <= 0)
            this.stop()
    }

    public refresh() {
        console.log("Get searches")
        this.websocketService.sendMsg(new MLMsgToGetSearches())
    }

    private start() {
        if (this.timer)
            return
        this.timer = interval(5000).subscribe(() => {
            this.refresh()
        })
    }

    private stop() {
        this.timer?.unsubscribe()
        this.timer = null
    }
}
