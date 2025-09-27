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

import { Injectable, OnDestroy, inject } from '@angular/core'
import { MLDownloadManager } from '../core/MLDownloadManager'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { MLObservableVariable } from '../core/MLObservableVariable'
import { WebSocketService } from '../websocket-service.service'
import { MLMsgDownloadElement, MLMsgFromDownloadState } from '../data/MLDownloadFileInfo'

@Injectable({
    providedIn: 'root'
})
export class DownloadingFilesService implements OnDestroy {
    websocketService = inject(WebSocketService)

    public downloadingFiles
    public downloadingList: MLObservableVariable<MLMsgDownloadElement[]> =
        new MLObservableVariable<MLMsgDownloadElement[]>([])

    private unsubscribe = new MLSubscriptionSet()

    constructor() {
        const websocketService = this.websocketService;

        this.downloadingFiles = new MLDownloadManager(websocketService)
        this.unsubscribe.add(this.downloadingFiles.elements.observable.subscribe((downloading) => {
            this.downloadingList.value = Array.from(downloading.values()).filter((e) => {
                switch (e.state) {
                case MLMsgFromDownloadState.S_DOWNLOADING:
                case MLMsgFromDownloadState.S_PAUSED:
                    return true;
                }
                return false;
            })
        }));
    }
    
    ngOnDestroy(): void {
        this.unsubscribe.unsubscribe(null)
    }
}
