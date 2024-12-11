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
    styleUrls: ['./corelogs.component.scss'],
    standalone: false
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
    showError = ""
    selectedRange = "1hour"

    constructor(private renderer: Renderer2) { }

    ngOnInit(): void {
        this.websocket = webSocket<string>({
            url: `ws://${environment.mldonkeyWsAddr}:${environment.logsWsPort}`,
            deserializer: (e: MessageEvent) => e.data,
            serializer: (b: string) => b
        })
        this.subscribed.add(this.websocket.subscribe({
            next: (data: string) => this.handleLine(data),
            error: (error: unknown) => this.handleError(error)
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
            this.buffer.push(l)
            if (this.selectedRange === "all") {
                this.toProcess.push(l)
                return
            }

            const since = new Date()
            switch (this.selectedRange) {
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
            if (l.timestamp >= since)
                this.toProcess.push(l)
        }
    }

    handleError(_error: unknown) {
        this.showError = "An error occurred trying to retrieve the logs."
        this.websocket?.unsubscribe()
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
            containerElement.removeChild(containerElement.lastChild)
    }

    processPendingLogs() {
        for (let i = 0; i < this.toProcess.length; i++) {
            const e = this.toProcess[i]
            this.showWaitingMessage = false
            const container = this.renderer.createElement("div")
            this.renderer.appendChild(this.scrollContainer.nativeElement, container)

            const bold = this.renderer.createElement('b')
            const dateText = this.renderer.createText(this.formatDate(e.timestamp))
            this.renderer.appendChild(bold, dateText)
        
            const span = this.renderer.createElement('span')
            this.renderer.setAttribute(span, 'class', 'span-tag')
            const tagText = this.renderer.createText(e.tag)
            this.renderer.appendChild(span, tagText)
        
            const wrapperText1 = this.renderer.createText(' - [')
            const wrapperText2 = this.renderer.createText(`]: ${e.text}`)
        
            this.renderer.appendChild(container, bold)
            this.renderer.appendChild(container, wrapperText1)
            this.renderer.appendChild(container, span)
            this.renderer.appendChild(container, wrapperText2)
        }
        this.toProcess = []

        if (this.toProcess.length > 0)
            requestAnimationFrame(() => this.processPendingLogs())
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const day = date.getDate().toString().padStart(2, '0')
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')

        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
    }
}
