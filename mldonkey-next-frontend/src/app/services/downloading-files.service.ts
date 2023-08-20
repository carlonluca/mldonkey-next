import { Injectable, OnDestroy } from '@angular/core';
import { MLDownloadManager } from '../core/MLDownloadManager';
import { MLSubscriptionSet } from '../core/MLSubscriptionSet';
import { MLMsgDownloadElement } from '../core/MLMsgDownload';
import { MLObservableVariable } from '../core/MLObservableVariable';
import { WebSocketService } from '../websocket-service.service';

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
            this.downloadingList.value = Array.from(downloading.values())
        }));
    }
    ngOnDestroy(): void {
        this.unsubscribe.unsubscribe(null)
    }
}
