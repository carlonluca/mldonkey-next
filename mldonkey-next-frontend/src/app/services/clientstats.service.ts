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
 * Date: 2024.09.01
 */

import { Injectable, OnDestroy, inject } from '@angular/core'
import { WebSocketService } from '../websocket-service.service'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { MLMsgFromClientStats } from '../msg/MLMsgClientStats'
import { MLObservableVariable } from '../core/MLObservableVariable'

@Injectable({
    providedIn: 'root'
})
export class ClientStatsService implements OnDestroy {
    private websocketService = inject(WebSocketService)

    private subscriptions = new MLSubscriptionSet()

    public stats: MLObservableVariable<MLMsgFromClientStats | null> =
        new MLObservableVariable<MLMsgFromClientStats | null>(null)

    constructor() {
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(msg => {
                if (msg.type === MLMessageTypeFrom.T_CLIENT_STATS) {
                    if (!this.stats)
                        this.stats = new MLObservableVariable<MLMsgFromClientStats | null>(msg as MLMsgFromClientStats)
                    else
                        this.stats.value = msg as MLMsgFromClientStats
                }
            })
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }
}
