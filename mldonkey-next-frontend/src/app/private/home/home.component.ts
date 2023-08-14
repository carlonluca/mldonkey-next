import { Component } from '@angular/core'
import { logger } from 'src/app/core/MLLogger'
import { MLMessageFromNetInfo } from 'src/app/core/MLMsgNetInfo'
import { WebSocketService } from 'src/app/websocket-service.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(private websocketService: WebSocketService) {
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg instanceof MLMessageFromNetInfo) {
                const netInfo = msg as MLMessageFromNetInfo
                logger.debug("Net info:", netInfo.name, netInfo.configFile, netInfo.connected, netInfo.flags)
            }
        })
    }
}
