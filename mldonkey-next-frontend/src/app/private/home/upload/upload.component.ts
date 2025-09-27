import { Component, OnDestroy, inject } from '@angular/core'
import { interval } from 'rxjs';
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet';
import { MLMessageTypeFrom } from 'src/app/msg/MLMsg';
import { MLMsgFromUploaders, MLMsgToGetUploaders } from 'src/app/msg/MLMsgUploaders';
import { WebSocketService } from 'src/app/websocket-service.service';

@Component({
    selector: 'app-upload',
    imports: [],
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnDestroy {
    private websocketService = inject(WebSocketService)

    private subscriptions = new MLSubscriptionSet()

    constructor() {
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(m => {
                if (m.type !== MLMessageTypeFrom.T_UPLOAD_FILES)
                    return
                console.log("uploaders:", (m as MLMsgFromUploaders).fileIds)
            })
        )
        this.subscriptions.add(
            interval(10000).subscribe(() => {
                this.websocketService.sendMsg(new MLMsgToGetUploaders())
            })
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }
}
