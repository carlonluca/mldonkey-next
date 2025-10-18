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
import { MLMsgFromPending, MLMsgFromUploaders, MLMsgToGetPending, MLMsgToGetUploaders } from '../msg/MLMsgUploaders'
import { SharedFilesinfoService } from './sharedfilesinfo.service'
import { MLMsgFromClientInfo, MLMsgToGetClientInfo } from '../msg/MLMsgClientInfo'
import { MLObservableVariable } from '../core/MLObservableVariable'

export class MLClientInfo {
    constructor(
        public info: MLMsgFromClientInfo,
        public speed: number | null,
        public timestamp: number
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
    public currentUploadFiles: MLObservableVariable<MLMsgFromUploaders | null> =
        new MLObservableVariable<MLMsgFromUploaders | null>(null)
    public currentPendingFiles: MLObservableVariable<MLMsgFromPending | null> =
        new MLObservableVariable<MLMsgFromPending | null>(null)
    // TODO: somehow clean this up
    public currentClientInfo: MLObservableVariable<MLClientInfo[]> =
        new MLObservableVariable<MLClientInfo[]>([])

    private lastUploaded: Map<number, number> = new Map<number, number>()

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

                if (m.type === MLMessageTypeFrom.T_PENDING) {
                    this.handlePendingFiles(m as MLMsgFromPending)
                    return
                }
            })
        )
        this.requestRefresh()
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }

    requestRefresh() {
        this.websocketService.sendMsg(new MLMsgToGetUploaders())
        this.websocketService.sendMsg(new MLMsgToGetPending())
    }

    protected handleUploadFiles(msg: MLMsgFromUploaders) {
        this.currentUploadFiles.value = msg
        for (const uploader of this.currentUploadFiles.value.clientNumbers)
            if (!this.currentClientInfo.value.find(info => info.info.clientId === uploader))
                // Avoid tight loop
                setTimeout(() => {
                    this.websocketService.sendMsg(new MLMsgToGetClientInfo(uploader))
                }, 1000)
    }

    protected handlePendingFiles(msg: MLMsgFromPending) {
        this.currentPendingFiles.value = msg
        for (const pending of this.currentPendingFiles.value.clientNumbers)
            if (!this.currentClientInfo.value.find(info => info.info.clientId === pending))
                // Avoid tight loop
                setTimeout(() => {
                    this.websocketService.sendMsg(new MLMsgToGetClientInfo(pending))
                }, 1000)
    }

    protected handleClientInfo(msg: MLMsgFromClientInfo) {
        const index = this.currentClientInfo.value.findIndex(clientInfo =>
            clientInfo.info.clientId === msg.clientId
        )
        if (index !== -1) {
            const info = this.currentClientInfo.value[index]
            const timestamp1 = info.timestamp
            const timestamp2 = performance.now()
            const uploaded1 = info.info.uploaded
            const uploaded2 = msg.uploaded
            const deltat = timestamp2 - timestamp1
            this.currentClientInfo.value[index] = new MLClientInfo(
                msg,
                deltat > 0 ? Number(uploaded2 - uploaded1)/deltat : 0,
                performance.now()
            )
            this.currentClientInfo.value = [...this.currentClientInfo.value]
            return
        }

        this.currentClientInfo.value.push(new MLClientInfo(msg, null, performance.now()))
        this.currentClientInfo.value = [...this.currentClientInfo.value]
    }
}
