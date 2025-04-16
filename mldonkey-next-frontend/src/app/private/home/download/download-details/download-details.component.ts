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
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute } from '@angular/router'
import { MLNetworkManager } from 'src/app/core/MLNetworkManager'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLUtils } from 'src/app/core/MLUtils'
import { MLMsgDownloadElement, MLMsgFromDownloadState } from 'src/app/data/MLDownloadFileInfo'
import { DownloadingFilesService } from 'src/app/services/downloading-files.service'
import { WebSocketService } from 'src/app/websocket-service.service'

enum RowElementType {
    E_T_BUFF_LIST,
    E_T_STRING_LIST,
    E_T_AVAIL_LIST
}

class RowElement {
    constructor(
        public name: string,
        public type: RowElementType,
        public data: (item: MLMsgDownloadElement | null) => ArrayBuffer[] | string[] | Map<string, ArrayBuffer>
    ) { }
}

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
    RowElementType = RowElementType
    dataSource = new MatTableDataSource<RowElement>([
        new RowElement("ID", RowElementType.E_T_STRING_LIST, item => [this.computeDownloadId(item)]),
        new RowElement("Network ID/name", RowElementType.E_T_STRING_LIST, item => [this.computeNetwork(item)]),
        new RowElement("Downloaded/size", RowElementType.E_T_STRING_LIST, item => [this.computeSize(item)]),
        new RowElement("Downloaded percentage", RowElementType.E_T_STRING_LIST, item => [this.computeDownloadedPercentage(item)]),
        new RowElement("Speed", RowElementType.E_T_STRING_LIST, item => [this.computeSpeed(item)]),
        new RowElement("Priority", RowElementType.E_T_STRING_LIST, item => [this.computePriority(item)]),
        new RowElement("User", RowElementType.E_T_STRING_LIST, item => [this.computeUser(item)]),
        new RowElement("Group", RowElementType.E_T_STRING_LIST, item => [this.computeGroup(item)]),
        new RowElement("Sources", RowElementType.E_T_STRING_LIST, item => [this.computeSources(item)]),
        new RowElement("Clients", RowElementType.E_T_STRING_LIST, item => [this.computeClients(item)]),
        new RowElement("Chunks", RowElementType.E_T_BUFF_LIST, item => [this.computeChunks(item)]),
        new RowElement("Name", RowElementType.E_T_STRING_LIST, item => [this.computeName(item)]),
        new RowElement("Suggested names", RowElementType.E_T_STRING_LIST, item => this.computeNames(item)),
        new RowElement("md4", RowElementType.E_T_STRING_LIST, item => [this.computeMd4(item)]),
        new RowElement("State", RowElementType.E_T_STRING_LIST, item => [this.computeState(item)]),
        new RowElement("Availability", RowElementType.E_T_AVAIL_LIST, item => this.computeAvailability(item)),
        new RowElement("File age", RowElementType.E_T_STRING_LIST, item => [this.computeFileAge(item)])
    ])

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
        return this.checkNull(item, item => item.name, "-")
    }

    computeDownloadId(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => "" + item.downloadId, "-")
    }

    computeNetwork(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            const id = item.netId
            return this.computeNetworkName(id)
        }, "-")
    }

    computeNetworkName(id: number): string {
        const name = this.networkManager.getWithKey(id)?.name
        return name ? `${id}/${name}` : "-"
    }

    computeSize(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            const hrDownloaded = MLUtils.beautifySize(item.downloaded)
            const hrSize = MLUtils.beautifySize(item.size)
            return `${hrDownloaded} / ${hrSize} | ${item.downloaded} bytes / ${item.size} bytes`
        }, "-")
    }

    computePriority(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            return "" + item.priority
        }, "-")
    }

    computeUser(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => item.fileUser, "-")
    }

    computeGroup(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => item.fileGroup, "-")
    }

    computeSources(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => "" + item.nlocations, "-")
    }

    computeClients(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => "" + item.nclients, "-")
    }

    computeChunks(item: MLMsgDownloadElement | null): ArrayBuffer {
        return item?.chunks ?? new ArrayBuffer()
    }

    computeNames(item: MLMsgDownloadElement | null): string[] {
        return this.checkNull(item, item => {
            return item.names
        }, new Array(0))
    }

    computeMd4(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            return MLUtils.buf2hex(item.md4).toLocaleUpperCase()
        }, "-")
    }

    computeDownloadedPercentage(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            return (Number(10000n * item.downloaded / item.size) / 10000).toFixed(4) + "%"
        }, "-")
    }

    computeState(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            return MLMsgFromDownloadState.toString(item.state)
        }, "-")
    }

    computeAvailability(item: MLMsgDownloadElement | null): Map<string, ArrayBuffer> {
        return this.checkNull(item, item => {
            const ret = new Map<string, ArrayBuffer>([])
            for (const avail of item.availability)
                ret.set(this.computeNetworkName(avail[0]), avail[1])
            return ret
        }, new Map<string, ArrayBuffer>())
    }

    computeSpeed(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            return MLUtils.beautifySpeed(item.speed)
        }, "-")
    }

    computeFileAge(item: MLMsgDownloadElement | null): string {
        return this.checkNull(item, item => {
            return MLUtils.prettyFormat(item.age)
        }, "-")
    }

    private checkNull<T>(item: MLMsgDownloadElement | null, f: (item: MLMsgDownloadElement) => T, nullValue: T): T {
        if (!item)
            return nullValue
        return f(item)
    }
}
