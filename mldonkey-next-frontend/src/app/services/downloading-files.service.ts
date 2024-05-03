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

import { Injectable, OnDestroy } from '@angular/core'
import { MLDownloadManager } from '../core/MLDownloadManager'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { MLObservableVariable } from '../core/MLObservableVariable'
import { WebSocketService } from '../websocket-service.service'
import { MLMsgDownloadElement, MLMsgFromDownloadState } from '../data/MLDownloadFileInfo'

@Injectable({
    providedIn: 'root'
})
export class DownloadingFilesService implements OnDestroy {
    public downloadingFiles
    public downloadingList: MLObservableVariable<MLMsgDownloadElement[]> =
        new MLObservableVariable<MLMsgDownloadElement[]>([])

    private unsubscribe = new MLSubscriptionSet()

    constructor(public websocketService: WebSocketService) {
        this.downloadingFiles = new MLDownloadManager(websocketService)
        this.unsubscribe.add(this.downloadingFiles.elements.observable.subscribe((downloading) => {
            this.downloadingList.value = Array.from(downloading.values()).filter((e) =>
                e.state == MLMsgFromDownloadState.S_DOWNLOADING)
        }));
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.unsubscribe(null)
    }
}
