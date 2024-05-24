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

import { Component, OnDestroy, OnInit } from '@angular/core'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { ConsoleService } from 'src/app/services/console.service'
import { WebSocketService } from 'src/app/websocket-service.service'

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit, OnDestroy {
    subscriptions: MLSubscriptionSet = new MLSubscriptionSet()
    messages: string[] = []

    constructor(public websocketService: WebSocketService, public consoleService: ConsoleService) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.consoleService.console.observable.subscribe(console => this.messages = console)
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }
}
