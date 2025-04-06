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
 * Date:    2025.04.06
 */

import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core'

@Component({
    selector: 'app-chunks-diagram',
    templateUrl: './chunks-diagram.component.html',
    styleUrl: './chunks-diagram.component.scss',
    standalone: false
})
export class ChunksDiagramComponent implements AfterViewInit, OnChanges {
    private ctx!: CanvasRenderingContext2D | null
    private colorForChunkValue = [
        "red",
        "orange",
        "lightgreen",
        "green"
    ]

    @Input() chunks: ArrayBuffer

    @ViewChild('myCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>

    ngAfterViewInit(): void {
        const canvas = this.canvasRef.nativeElement
        this.ctx = canvas.getContext('2d')
        this.draw()
    }

    ngOnChanges(_changes: SimpleChanges) {
        if (this.ctx)
            this.draw()
    }

    private draw() {
        if (!this.ctx)
            return
        
        const ctx = this.ctx
        const canvas = this.canvasRef.nativeElement
        const width = canvas.width
        const height = canvas.height
        if (this.chunks.byteLength <= 0) {
            this.drawNull(ctx, width, height)
            return
        }

        const chunkWidth = width/this.chunks.byteLength
        if (chunkWidth <= 0) {
            this.drawNull(ctx, width, height)
            return
        }

        const view = new Uint8Array(this.chunks)
        for (let i = 0; i < this.chunks.byteLength; i++) {
            const chunkX = i*chunkWidth
            console.log("color:", this.colorForChunkValue[(view.at(i) ?? 48) - 48], (view.at(i) ?? 48) - 48)
            ctx.fillStyle = this.colorForChunkValue[(view.at(i) ?? 48) - 48]
            ctx.fillRect(chunkX, 0, chunkWidth, height)
        }
    }

    private drawNull(ctx: CanvasRenderingContext2D, width: number, height: number) {
        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, width, height)
    }
}
