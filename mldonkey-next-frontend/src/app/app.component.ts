import { Component } from '@angular/core'
import { WebSocketService } from './websocket-service.service'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'mldonket-next-frontend';

    constructor(private webSocketService: WebSocketService) { }

    ngOnInit(): void {
        this.webSocketService.connect(`ws://${window.location.hostname}:8080`);
    }
}
