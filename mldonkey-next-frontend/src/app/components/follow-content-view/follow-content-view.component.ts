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
 * Date:    2025.01.03
 */

import { Component, ElementRef, ViewChild } from '@angular/core'
import { faArrowUp, faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons'
import { ScrollToBottomDirective } from 'src/app/private/home/corelogs/scroll'

@Component({
    selector: 'app-follow-content-view',
    templateUrl: './follow-content-view.component.html',
    styleUrl: './follow-content-view.component.scss',
    standalone: false
})
export class FollowContentViewComponent {
    @ViewChild('scrollContainer') scrollContainer: ElementRef
    @ViewChild("contentSection") contentSection: ElementRef
    @ViewChild(ScrollToBottomDirective) scrollDirective: ScrollToBottomDirective

    faPersonWalkingArrowRight = faPersonWalkingArrowRight
    faArrowUp = faArrowUp
    follow = true

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
