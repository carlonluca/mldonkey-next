import { Component } from '@angular/core'
import { MLMessageNetInfo } from 'src/app/core/MLMessage'
import { WebSocketService } from 'src/app/websocket-service.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(private websocketService: WebSocketService) {
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg instanceof MLMessageNetInfo) {
                const netInfo = (msg as MLMessageNetInfo).name
                console.log("Net info:", netInfo)
            }
        })
    }
}
