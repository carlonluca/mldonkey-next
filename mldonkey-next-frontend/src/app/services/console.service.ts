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

import { Injectable } from '@angular/core'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { MLConnectionState, WebSocketService } from '../websocket-service.service'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { MLMsgFromConsole } from '../msg/MLMsgConsole'
import { MLObservableVariable } from '../core/MLObservableVariable'

@Injectable({
    providedIn: 'root'
})
export class ConsoleService {
    subscriptions: MLSubscriptionSet = new MLSubscriptionSet()
    messages = ""
    console = new MLObservableVariable<string[]>([])

    constructor(public websocketService: WebSocketService) {
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(m => {
                if (m.type === MLMessageTypeFrom.T_CONSOLE) {
                    const messages = this.console.value
                    const date = new Date()
                    const pad = (num: number): string => (num < 10 ? '0' : '') + num
                    const year = date.getFullYear()
                    const month = pad(date.getMonth() + 1)
                    const day = pad(date.getDate())
                    const hours = pad(date.getHours())
                    const minutes = pad(date.getMinutes())
                    const seconds = pad(date.getSeconds())
                    const command = (m as MLMsgFromConsole).command
                    const line = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}\n${command}`
                    messages.push(line)
                }
            })
        )
        this.subscriptions.add(
            this.websocketService.connectionState.observable.subscribe(state => {
                if (state === MLConnectionState.S_NOT_CONNECTED)
                    this.console.value = []
            })
        )
    }
}
