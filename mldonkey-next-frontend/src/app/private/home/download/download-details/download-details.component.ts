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
        console.log("ID:", id)
        
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

    private checkNull(item: MLMsgDownloadElement | null, f: (item: MLMsgDownloadElement) => string): string {
        if (!item)
            return "-"
        return f(item)
    }
}
