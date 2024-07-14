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
import { faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-corelogs',
    templateUrl: './corelogs.component.html',
    styleUrls: ['./corelogs.component.scss']
})
export class CorelogsComponent implements OnInit, OnDestroy {
    @ViewChild('scrollContainer') scrollContainer: ElementRef
    @ViewChild(ScrollToBottomDirective) scrollDirective: ScrollToBottomDirective

    faPersonWalkingArrowRight = faPersonWalkingArrowRight

    lastId = 0
    buffer: string[] = []
    websocket: WebSocketSubject<string> | null = null
    follow = true

    constructor(private renderer: Renderer2) { }

    ngOnInit(): void {
        this.websocket = webSocket<string>({
            url: `ws://${environment.mldonkeyWsAddr}:${environment.logsWsPort}`,
            deserializer: (e: MessageEvent) => e.data,
            serializer: (b: string) => b
        })
        this.websocket.subscribe({
            next: (data: string) => this.handleLine(data)
        })
        interval(500).subscribe(() => {
            this.buffer.forEach(e => {
                const paragraph = this.renderer.createElement('p')
                const textNode = this.renderer.createText(e)
                this.renderer.appendChild(paragraph, textNode)
                this.renderer.appendChild(this.scrollContainer.nativeElement, paragraph)
            })
            this.buffer = []
        })
    }

    ngOnDestroy(): void {
        this.websocket?.unsubscribe()
    }

    handleLine(line: string) {
        this.buffer.push(line)
    }

    onScroll(_event: WheelEvent) {
        this.scrollDirective.follow = false
        this.follow = false
    }

    doFollow() {
        this.scrollDirective.follow = true
        this.follow = true
    }
}
