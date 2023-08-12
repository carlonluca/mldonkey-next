import { WebSocketService } from "../websocket-service.service"
import { MLMessageNetInfo, MLMessageTypeFrom } from "./MLMessage"

export class MLNetworkManager {
    public networks: Map<number, MLMessageNetInfo> = new Map()

    constructor(private websocketService: WebSocketService) {
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type == MLMessageTypeFrom.T_NET_INFO) {
                const netInfo = msg as MLMessageNetInfo
                this.networks.set(netInfo.netNum, netInfo)
            }
        })
    }
}
