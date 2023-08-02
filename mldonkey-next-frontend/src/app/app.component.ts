import { Component } from '@angular/core'
import { WebSocketService } from './websocket-service.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mldonket-next-frontend';

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    // Replace 'ws://your-websocket-server-url' with the actual WebSocket server URL
    this.webSocketService.connect('ws://localhost:8080');
  }

  sendMessage(): void {
    const message = 'Hello, WebSocket server!';
    this.webSocketService.send(message);
  }
}
