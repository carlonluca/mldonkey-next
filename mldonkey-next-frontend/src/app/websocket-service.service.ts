import { Injectable } from '@angular/core'
import { webSocket, WebSocketSubject } from 'rxjs/webSocket'
import * as ML from './core/MLMsg'
import { MLObservableVariable } from './core/MLObservableVariable'
import { MLUtils } from './core/MLUtils'
import { MLNetworkManager } from './core/MLNetworkManager'
import { logger } from './core/MLLogger'

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
    public lastMessage: MLObservableVariable<ML.MLMessageFrom> =
        new MLObservableVariable<ML.MLMessageFrom>(new ML.MLMessageFromNone())
    public networkManager: MLNetworkManager

    private buffer: ArrayBuffer = new ArrayBuffer(0)

    constructor() {
        this.networkManager = new MLNetworkManager(this)
    }

    public connect(url: string): void {
        this.webSocket = webSocket<ArrayBuffer>({
            url: url,
            binaryType: "arraybuffer",
            deserializer: (e: MessageEvent) => e.data,
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

    public login(usr: string, pwd: string) {
        this.sendMsg(new ML.MLMessageToPassword(usr, pwd))
    }

    public sendData(msg: ArrayBuffer) {
        logger.trace("-> ", MLUtils.buf2hex(msg))
        this.webSocket.next(msg)
    }

    public sendMsg(msg: ML.MLMessageTo) {
        this.sendData(msg.toBuffer())
    }

    private onMessageReceived(data: ArrayBuffer): void {
        this.buffer = MLUtils.concatArrayBuffers(this.buffer, data)
        logger.trace('<-' , MLUtils.buf2hex(this.buffer))

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const [msg, consumed, tryAgain] = ML.MLMessage.processBuffer(this.buffer)
            this.buffer = this.buffer.slice(consumed)
            if (!msg)
                return
            if (msg)
                logger.info("<- Message received:", msg.type)
            if (msg.type == ML.MLMessageTypeFrom.T_CORE_PROTOCOL)
                this.sendMsg(new ML.MLMessageGuiProtocol(33))
            else if (msg.type != ML.MLMessageTypeFrom.T_BAD_PASSWORD)
                this.connectionState.value = MLConnectionState.S_AUTHENTICATED
            this.lastMessage.value = msg
            if (!tryAgain)
                break
        }
    }

    private onError(error: unknown): void {
        logger.error('WebSocket error:', error)
    }

    private onClose(): void {
        logger.info('WebSocket connection closed.')
    }
}
