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
 * Date: 2023.11.15
 */
import { MLResultInfo } from "../data/MLResultInfo";
import { MLMessageTypeFrom } from "../msg/MLMsg";
import { MLMsgFromResultInfo } from "../msg/MLMsgQuery";
import { WebSocketService } from "../websocket-service.service";
import { MLCollectionModel } from "./MLCollectionModel";

export class MLResultInfoManager extends MLCollectionModel<number, MLResultInfo> {
    constructor(websocketService: WebSocketService) {
        super()
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type == MLMessageTypeFrom.T_RESULT_INFO) {
                this.handleValue((msg as MLMsgFromResultInfo).content)
            }
        })
    }

    protected override keyFromValue(value: MLResultInfo): number {
        return value.id
    }
}
