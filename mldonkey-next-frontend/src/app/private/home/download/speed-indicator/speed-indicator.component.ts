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
 * Date: 2024.09.05
 */

import { Component, Input } from '@angular/core';
import { faArrowDown, faArrowUp, faPause } from '@fortawesome/free-solid-svg-icons';
import { MLMsgFromDownloadState } from 'src/app/data/MLDownloadFileInfo';

@Component({
    selector: 'app-speed-indicator',
    templateUrl: './speed-indicator.component.html',
    styleUrl: './speed-indicator.component.scss',
    standalone: false
})
export class SpeedIndicatorComponent {
    @Input({ required: true }) speed: number
    @Input({ required: false }) download: boolean = true
    @Input({ required: false }) bold: boolean
    @Input({ required: false }) downloadState = MLMsgFromDownloadState.S_DOWNLOADING
    faArrowDown = faArrowDown
    faArrowUp = faArrowUp
    faPause = faPause

    isDownloading(): boolean {
        return this.downloadState !== MLMsgFromDownloadState.S_PAUSED
    }

    isStuck(): boolean {
        return this.speed < 1E-6
    }
}
