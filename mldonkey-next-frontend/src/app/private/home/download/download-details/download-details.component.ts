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
 * Date:    2025.04.02
 */

import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MLNetworkManager } from 'src/app/core/MLNetworkManager'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLUtils } from 'src/app/core/MLUtils'
import { MLMsgDownloadElement } from 'src/app/data/MLDownloadFileInfo'
import { DownloadingFilesService } from 'src/app/services/downloading-files.service'
import { WebSocketService } from 'src/app/websocket-service.service'

@Component({
    selector: 'app-download-details',
    templateUrl: './download-details.component.html',
    styleUrl: './download-details.component.scss',
    standalone: false
})
export class DownloadDetailsComponent implements OnInit, OnDestroy {
    item: MLMsgDownloadElement | null = null
    networkManager: MLNetworkManager
    subscriptions = new MLSubscriptionSet()

    constructor(
        private router: ActivatedRoute,
        private downloadService: DownloadingFilesService,
        protected websocketService: WebSocketService
    ) {
        this.networkManager = this.websocketService.networkManager
    }

    ngOnInit(): void {
        const id = this.router.snapshot.paramMap.get("id")
        if (!id)
            return
        
        const iid = parseInt(id)
        this.subscriptions.add(
            this.downloadService.downloadingList.observable.subscribe(list => {
                this.item = list.find(d => d.downloadId === iid) ?? null
            })
        )
        this.item = this.downloadService.downloadingList.value.find((d) => d.downloadId === iid) ?? null
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }

    computeName(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => item.name)
    }

    computeDownloadId(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => "" + item.downloadId)
    }

    computeNetwork(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            const id = item.netId
            const name = this.networkManager.getWithKey(id)?.name
            return name ? `${id} - ${name}` : "-"
        })
    }

    computeSize(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            const hrDownloaded = MLUtils.beautifySize(item.downloaded)
            const hrSize = MLUtils.beautifySize(item.size)
            return `${hrDownloaded} / ${hrSize} | ${item.downloaded} bytes / ${item.size} bytes`
        })
    }

    computePriority(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            return "" + item.priority
        })
    }

    computeUser(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => item.fileUser)
    }

    computeGroup(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => item.fileGroup)
    }

    computeSources(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => "" + item.nlocations)
    }

    computeClients(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => "" + item.nclients)
    }

    computeChunks(item: MLMsgDownloadElement | null): ArrayBuffer {
        return item?.chunks ?? new ArrayBuffer()
    }

    private checkNull(item: MLMsgDownloadElement | null, f: (item: MLMsgDownloadElement) => string): string {
        if (!item)
            return "-"
        return f(item)
    }
}
