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

import { AfterViewInit, Component, ElementRef, Renderer2, inject } from '@angular/core'

@Component({
    selector: 'app-turtle-icon',
    templateUrl: '../../../assets/turtle.svg',
    standalone: false
})
export class TurtleIconComponent implements AfterViewInit {
    private elRef = inject(ElementRef)
    private renderer = inject(Renderer2)

    fillColor = 'rgb(255, 255, 255)'
    
    constructor() {}

    ngAfterViewInit(): void {
        // Set width and height dynamically in pixels
        const svgElement = this.elRef.nativeElement.querySelector('svg')

        // Get the computed style of the element
        const computedStyle = getComputedStyle(this.elRef.nativeElement)
        const fontSize = parseFloat(computedStyle.fontSize)

        // Set the SVG's width and height using Renderer2
        this.renderer.setAttribute(svgElement, 'width', `${fontSize*1.5}`)
        this.renderer.setAttribute(svgElement, 'height', `${fontSize*0.7}`)
    }

    changeColor() {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        this.fillColor = `rgb(${r}, ${g}, ${b})`
    }
}
