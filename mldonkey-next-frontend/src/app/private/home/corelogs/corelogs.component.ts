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
 * Date: 2024.07.07
 */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Renderer2 } from '@angular/core'
import { interval } from 'rxjs'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import { environment } from 'src/environments/environment'
import { ScrollToBottomDirective } from './scroll'
import { faArrowUp, faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { uiLogger } from 'src/app/core/MLLogger'

class LogLine {
    timestamp: Date
    tag: string
    text: string

    static parse(line: string): LogLine | null {
        const logPattern = /(\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\] (.+)/
        const match = line.match(logPattern)
        if (match) {
            const timestamp = new Date(match[1])
            const tag = match[2]
            const text = match[3]
            return {
                timestamp,
                tag,
                text
            }
        }
        else
            return null
    }
}

@Component({
    selector: 'app-corelogs',
    templateUrl: './corelogs.component.html',
    styleUrls: ['./corelogs.component.scss']
})
export class CorelogsComponent implements OnInit, OnDestroy {
    @ViewChild('scrollContainer') scrollContainer: ElementRef
    @ViewChild(ScrollToBottomDirective) scrollDirective: ScrollToBottomDirective

    faPersonWalkingArrowRight = faPersonWalkingArrowRight
    faArrowUp = faArrowUp

    lastId = 0
    buffer: LogLine[] = []
    toProcess: LogLine[] = []
    websocket: WebSocketSubject<string> | null = null
    follow = true
    subscribed = new MLSubscriptionSet()
    showWaitingMessage = true
    selectedRange = "1hour"

    constructor(private renderer: Renderer2) { }

    ngOnInit(): void {
        this.websocket = webSocket<string>({
            url: `ws://${environment.mldonkeyWsAddr}:${environment.logsWsPort}`,
            deserializer: (e: MessageEvent) => e.data,
            serializer: (b: string) => b
        })
        this.subscribed.add(this.websocket.subscribe({
            next: (data: string) => this.handleLine(data)
        }))
        this.subscribed.add(interval(500).subscribe(() => {
            requestAnimationFrame(() => this.processPendingLogs())
        }))
    }

    ngOnDestroy(): void {
        this.websocket?.unsubscribe()
    }

    handleLine(line: string) {
        const l = LogLine.parse(line)
        if (l) {
            this.toProcess.push(l)
            this.buffer.push(l)
            uiLogger.debug("To process:", this.toProcess.length)
        }
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

    selectedRangeChanged() {
        this.toProcess = this.buffer
        const containerElement = this.scrollContainer.nativeElement
        while (containerElement.firstChild)
            this.renderer.removeChild(containerElement, containerElement.firstChild)
    }

    processPendingLogs() {
        const since = new Date()
        switch (this.selectedRange) {
            case "all":
                break
            case "1year":
                since.setMonth(since.getMonth() - 12)
                break
            case "1month":
                since.setMonth(since.getMonth() - 1)
                break
            case "1week":
                since.setHours(since.getHours() - 24 * 7)
                break
            case "1day":
                since.setHours(since.getHours() - 24)
                break
            case "1hour":
                since.setHours(since.getHours() - 1)
                break
        }
        for (var i = 0; i < this.toProcess.length; i++) {
            const e = this.toProcess[i]
            if (e.timestamp >= since || this.selectedRange === "all") {
                this.showWaitingMessage = false
                const paragraph = this.renderer.createElement('p')
                const textNode = this.renderer.createText(e.timestamp + " " + e.text)
                this.renderer.appendChild(paragraph, textNode)
                this.renderer.appendChild(this.scrollContainer.nativeElement, paragraph)
            }
        }
        this.toProcess = []
        uiLogger.debug("Done:", this.toProcess.length)

        if (this.toProcess.length > 0)
            requestAnimationFrame(() => this.processPendingLogs())
    }
}
