/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2025 Luca Carlon
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
 * Date:    2025.02.24
 */

import { Injectable } from '@angular/core'
import { MLCollectionModel } from '../core/MLCollectionModel'
import { WebSocketService } from '../websocket-service.service'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { MLMsgFromSharedFileInfo } from '../msg/MLMsgSharedFileInfo'

@Injectable({
    providedIn: 'root'
})
export class SharedFilesinfoService extends MLCollectionModel<number, MLMsgFromSharedFileInfo> {
    constructor(websocketService: WebSocketService) {
        super()
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type == MLMessageTypeFrom.T_SHARED_FILE_INFO) {
                this.handleValue(msg as MLMsgFromSharedFileInfo)
            }
        })
    }

    protected override keyFromValue(value: MLMsgFromSharedFileInfo): number {
        return value.sharedFileId
    }
}
