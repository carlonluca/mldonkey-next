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
 * Date:    2025.01.04
 */

import { Injectable, OnDestroy, inject } from '@angular/core'
import { WebSocketService } from '../websocket-service.service'
import { MLServerManager } from '../core/MLServerManager'
import { MLObservableVariable } from '../core/MLObservableVariable'
import { MLMsgFromServerInfo } from '../msg/MLMsgServer'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'

@Injectable({
    providedIn: 'root'
})
export class ServersService implements OnDestroy {
    websocketService = inject(WebSocketService)

    private unsubscribe = new MLSubscriptionSet()
    public serverManager: MLServerManager
    public serverList = new MLObservableVariable<MLMsgFromServerInfo[]>([])

    constructor() {
        const websocketService = this.websocketService;

        this.serverManager = new MLServerManager(websocketService)
        this.unsubscribe.add(
            this.serverManager.elements.observable.subscribe((servers) => {
                this.refreshList(servers)
            })
        )

        this.refreshList(this.serverManager.elements.value)
    }

    ngOnDestroy(): void {
        this.unsubscribe.unsubscribe(null)
    }

    private refreshList(servers: Map<number, MLMsgFromServerInfo>) {
        this.serverList.value = Array.from(servers.values())
    }
}
