import { Injectable } from '@angular/core'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    private socket$!: WebSocketSubject<any>

    constructor() { }

    public connect(url: string): void {
        this.socket$ = webSocket({
            url,
            deserializer: msg => msg
        })
        this.socket$.subscribe(
            (data: ArrayBuffer | Blob | string) => this.onMessageReceived(data),
            (error) => this.onError(error),
            () => this.onClose()
        )
    }

    public send(message: any): void {
        this.socket$.next(message);
    }

    private onMessageReceived(data: ArrayBuffer | Blob | string): void {
        console.log('Received:', data)
    }

    private onError(error: any): void {
        console.error('WebSocket error:', error);
    }

    private onClose(): void {
        console.log('WebSocket connection closed.');
    }
}
