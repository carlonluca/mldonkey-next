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
import { MLMsgFromClientInfo, MLMsgToGetClientInfo } from '../msg/MLMsgClientInfo'
import { MLObservableVariable } from '../core/MLObservableVariable'

@Injectable({
    providedIn: 'root'
})
export class UploadsService implements OnDestroy {
    private REFRESH_INTERVAL = 10000
    private websocketService = inject(WebSocketService)
    private sharedService = inject(SharedFilesinfoService)
    private subscriptions = new MLSubscriptionSet()
    public currentUploadFiles: MLObservableVariable<MLMsgFromUploaders | null> =
        new MLObservableVariable<MLMsgFromUploaders | null>(null)
    public currentClientInfo: MLObservableVariable<MLMsgFromClientInfo[]> =
        new MLObservableVariable<MLMsgFromClientInfo[]>([])

    constructor() {
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(m => {
                if (m.type === MLMessageTypeFrom.T_UPLOAD_FILES) {
                    this.handleUploadFiles(m as MLMsgFromUploaders)
                    return
                }

                if (m.type === MLMessageTypeFrom.T_CLIENT_INFO) {
                    this.handleClientInfo(m as MLMsgFromClientInfo)
                    return
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

    protected handleUploadFiles(msg: MLMsgFromUploaders) {
        this.currentUploadFiles.value = msg
        this.currentClientInfo.value.filter(clientInfo =>
            msg.clientNumbers.indexOf(clientInfo.clientId) >= 0)
        for (const uploader of this.currentUploadFiles.value.clientNumbers)
            if (!this.currentClientInfo.value.find(info => info.clientId === uploader))
                this.websocketService.sendMsg(new MLMsgToGetClientInfo(uploader))
    }

    protected handleClientInfo(msg: MLMsgFromClientInfo) {
        const index = this.currentClientInfo.value.findIndex(clientInfo => clientInfo.clientId === msg.clientId)
        if (index !== -1) {
            this.currentClientInfo.value[index] = msg
            return
        }

        this.currentClientInfo.value.push(msg)
        this.currentClientInfo.value = [...this.currentClientInfo.value]
    }
}
