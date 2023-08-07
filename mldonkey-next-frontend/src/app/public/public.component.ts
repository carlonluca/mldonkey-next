import { Component, OnInit } from '@angular/core'
import { MLConnectionState, WebSocketService } from '../websocket-service.service'

@Component({
    selector: 'app-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
    public connected: Boolean = false

    constructor(private webSocketService: WebSocketService) {
        webSocketService.connectionState.observable.subscribe(state => {
            switch (state) {
                case MLConnectionState.S_AUTHENTICATED:
                case MLConnectionState.S_CONNECTED:
                    this.connected = true
                    break
                default:
                    this.connected = false
                    break
            }
        })

        this.webSocketService.connect(`ws://${window.location.hostname}:8080`)
    }

    ngOnInit() {
        
    }
}
