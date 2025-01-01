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

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { ConsoleService } from 'src/app/services/console.service'
import { WebSocketService } from 'src/app/websocket-service.service'
import { ScrollToBottomDirective } from '../corelogs/scroll'

@Component({
    selector: 'app-console',
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
    standalone: false
})
export class ConsoleComponent implements OnInit, OnDestroy {
    @ViewChild('scrollContainer') scrollContainer: ElementRef
    @ViewChild(ScrollToBottomDirective) scrollDirective: ScrollToBottomDirective

    subscriptions: MLSubscriptionSet = new MLSubscriptionSet()
    messages: string[] = []
    follow = true

    constructor(public websocketService: WebSocketService, public consoleService: ConsoleService) { }

    ngOnInit(): void {
        this.subscriptions.add(
            this.consoleService.console.observable.subscribe(console => this.messages = console)
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }

    onScroll(_event: WheelEvent) {
        this.dontFollow()
    }

    doFollow() {
        this.scrollDirective.follow = true
        this.follow = true
        this.scrollToBottom()
    }

    scrollToTop() {
        this.dontFollow()
        this.scrollContainer.nativeElement.scrollTop = 0
    }

    scrollToBottom() {
        if (this.scrollDirective)
            this.scrollDirective.scrollToBottom()
    }

    dontFollow() {
        this.scrollDirective.follow = false
        this.follow = false
    }

    isAtTop() {
        if (!this.scrollContainer)
            return true
        return this.scrollContainer.nativeElement.scrollTop === 0
    }
}
