import { WebSocketService } from "../websocket-service.service"
import { MLMessageTypeFrom } from "./MLMsg"
import { MLMessageFromNetInfo } from "./MLMsgNetInfo"

export class MLNetworkManager {
    public networks: Map<number, MLMessageFromNetInfo> = new Map()

    constructor(private websocketService: WebSocketService) {
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type == MLMessageTypeFrom.T_NET_INFO) {
                const netInfo = msg as MLMessageFromNetInfo
                this.networks.set(netInfo.netNum, netInfo)
            }
        })
    }
}
