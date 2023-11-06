/*
 * This file is part of mldonket-next.
 *
 * Copyright (c) 2023 Luca Carlon
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2023.08.14
 */

import { WebSocketService } from "../websocket-service.service"
import { MLCollectionModel } from "./MLCollectionModel"
import { MLMessageTypeFrom } from "./MLMsg"
import { MLMsgFromNetInfo } from "./MLMsgNetInfo"

export class MLNetworkManager extends MLCollectionModel<number, MLMsgFromNetInfo> {
    constructor(private websocketService: WebSocketService) {
        super()
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type == MLMessageTypeFrom.T_NETWORK_INFO) {
                this.handleValue(msg as MLMsgFromNetInfo)
            }
        })
    }

    protected override keyFromValue(value: MLMsgFromNetInfo): number {
        return value.netNum
    }
}
