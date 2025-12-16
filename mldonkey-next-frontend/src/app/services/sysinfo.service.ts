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

import { Injectable, OnDestroy, inject } from '@angular/core'
import { MLConnectionState, WebSocketService } from '../websocket-service.service'
import { MLMsgFromSysInfo, MLMsgToGetSysInfo } from '../msg/MLMsgSysInfo'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { MLObservableVariable } from '../core/MLObservableVariable'
import { MLMinProtoError } from '../core/MLMinProtoErr'

@Injectable({
    providedIn: 'root'
})
export class SysinfoService implements OnDestroy {
    private websocketService = inject(WebSocketService);

    public sysInfo = new MLObservableVariable<MLMsgFromSysInfo | null | MLMinProtoError>(null)
    private subscriptions: MLSubscriptionSet = new MLSubscriptionSet()

    constructor() {
        setInterval(() => {
            if (this.websocketService.connectionState.value === MLConnectionState.S_AUTHENTICATED) {
                if (this.websocketService.protocol < 42)
                    this.sysInfo.value = new MLMinProtoError(this.websocketService.protocol)
                else
                    this.websocketService.sendMsg(new MLMsgToGetSysInfo())
            }
        }, 1000)
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(msg => {
                if (msg.type === MLMessageTypeFrom.T_SYSINFO) {
                    this.sysInfo.value = msg as MLMsgFromSysInfo
                }
            })
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }
}
