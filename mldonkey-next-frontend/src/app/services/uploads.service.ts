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
 * Date:    2025.10.07
 */

import { inject, Injectable, OnDestroy } from '@angular/core'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { WebSocketService } from '../websocket-service.service'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { MLMsgFromUploaders, MLMsgToGetUploaders } from '../msg/MLMsgUploaders'
import { interval } from 'rxjs'
import { SharedFilesinfoService } from './sharedfilesinfo.service'
import { MLMsgFromSharedFileInfo } from '../msg/MLMsgSharedFileInfo'

export class MLUpload {
    constructor(
        public fileId: number,
        public fileInfo: MLMsgFromSharedFileInfo
    ) {}
}

@Injectable({
    providedIn: 'root'
})
export class UploadsService implements OnDestroy {
    private REFRESH_INTERVAL = 10000
    private websocketService = inject(WebSocketService)
    private sharedService = inject(SharedFilesinfoService)
    private subscriptions = new MLSubscriptionSet()

    constructor() {
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(m => {
                if (m.type !== MLMessageTypeFrom.T_UPLOAD_FILES)
                    return
                for (const fileId of (m as MLMsgFromUploaders).fileIds) {
                    const info = this.sharedService.getWithKey(fileId)
                    console.log("uploaders:", fileId, info?.sharedFileId, info?.fileName, this.sharedService.elements)
                }
            })
        )
        this.subscriptions.add(
            interval(this.REFRESH_INTERVAL).subscribe(() => {
                this.websocketService.sendMsg(new MLMsgToGetUploaders())
            })
        )
        this.websocketService.sendMsg(new MLMsgToGetUploaders())
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }
}
