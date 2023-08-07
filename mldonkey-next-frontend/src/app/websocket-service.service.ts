import { Injectable } from '@angular/core'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import * as ML from './core/MLMessage'
import { MLObservableVariable } from './core/MLObservableVariable'

export enum MLConnectionState {
    S_NOT_CONNECTED,
    S_CONNECTED,
    S_AUTHENTICATED
}

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {
    public webSocket!: WebSocketSubject<ArrayBuffer>
    public connectionState: MLObservableVariable<MLConnectionState> =
        new MLObservableVariable<MLConnectionState>(MLConnectionState.S_NOT_CONNECTED)

    constructor() { }

    public connect(url: string): void {
        this.webSocket = webSocket<ArrayBuffer>({
            url: url,
            binaryType: "arraybuffer",
            deserializer: (e: MessageEvent<any>) => e.data,
            serializer: (b: ArrayBuffer) => b,
            openObserver: {
                next: value => {
                    this.connectionState.value = value ? MLConnectionState.S_CONNECTED : MLConnectionState.S_NOT_CONNECTED
                }
            }
        })
        this.webSocket.subscribe({
            next: (data: ArrayBuffer) => this.onMessageReceived(data),
            error: (error) => this.onError(error),
            complete: () => this.onClose()
        })
    }

    public send(message: ArrayBuffer): void {
        this.webSocket.next(message)
    }

    private onMessageReceived(data: ArrayBuffer): void {
        console.log('Received:', data)
        let msg = ML.MLMessage.processBuffer(data)
        if (!msg)
            return
        switch (msg.type) {
            case ML.MLMessageTypeFrom.T_CORE_PROTOCOL:
                this.send(new ML.MLMessageGuiProtocol(33).toBuffer())
                this.send(new ML.MLMessageToPassword(
                    "",
                    ""
                ).toBuffer())
                break
        }
    }

    private onError(error: any): void {
        console.error('WebSocket error:', error);
    }

    private onClose(): void {
        console.log('WebSocket connection closed.');
    }
}
