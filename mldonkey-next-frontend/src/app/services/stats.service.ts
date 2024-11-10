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
 * Date: 2024.11.10
 */

import { Injectable } from '@angular/core'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { WebSocketService } from '../websocket-service.service'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { interval } from 'rxjs'
import { MLMsgToGetStats } from '../msg/MLMsgStats'

@Injectable({
    providedIn: 'root'
})
export class StatsService {
    private subscriptions = new MLSubscriptionSet()
    
    constructor(private websocketService: WebSocketService) {
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(m => {
                if (m.type !== MLMessageTypeFrom.T_STATS)
                    return
            })
        )
        this.subscriptions.add(
            interval(10000).subscribe(() => {
                this.websocketService.sendMsg(new MLMsgToGetStats(8))
            })
        )
    }
}
