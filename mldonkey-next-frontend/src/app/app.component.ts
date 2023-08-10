import { Component } from '@angular/core'
import { WebSocketService } from './websocket-service.service'
import { RouterOutlet } from '@angular/router'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'mldonket-next-frontend'
}
