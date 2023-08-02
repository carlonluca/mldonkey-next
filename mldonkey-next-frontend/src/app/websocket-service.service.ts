// web-socket.service.ts
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<any>

  constructor() { }

  public connect(url: string): void {
    this.socket$ = webSocket(url);
    this.socket$.subscribe(
      (message) => this.onMessageReceived(message),
      (error) => this.onError(error),
      () => this.onClose()
    );
  }

  public send(message: any): void {
    this.socket$.next(message);
  }

  private onMessageReceived(message: any): void {
    // Handle the received message from the server
    console.log('Received:', message);
  }

  private onError(error: any): void {
    // Handle errors
    console.error('WebSocket error:', error);
  }

  private onClose(): void {
    // Handle WebSocket connection closing
    console.log('WebSocket connection closed.');
  }
}
