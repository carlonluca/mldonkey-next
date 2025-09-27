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
import { Directive, ElementRef, AfterContentChecked, inject } from '@angular/core'

@Directive({
    selector: '[appScrollToBottom]',
    standalone: false
})
export class ScrollToBottomDirective implements AfterContentChecked {
    private el = inject(ElementRef)

    follow = true

    constructor() { }

    ngAfterContentChecked() {
        if (this.follow)
            this.scrollToBottom()
    }

    scrollToBottom(): void {
        try {
            this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
        }
        catch (err) {
            console.error('Scroll to bottom failed:', err);
        }
    }
}
