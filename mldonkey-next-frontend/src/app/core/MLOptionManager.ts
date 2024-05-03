/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2024 Luca Carlon
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

import { MLMsgFromAddSectionOption } from "../msg/MLMsgOptions"
import { MLCollectionModel } from "./MLCollectionModel"
import { WebSocketService } from "../websocket-service.service"
import { MLMessageTypeFrom } from "../msg/MLMsg"

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2024.05.03
 */
export class MLOptionSection {
    public name: string
    public options: MLMsgFromAddSectionOption[]
}

export class MLOptionManager extends MLCollectionModel<string, MLMsgFromAddSectionOption> {
    constructor(websocketService: WebSocketService) {
        super()
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type === MLMessageTypeFrom.T_ADD_SECTION_OPTION)
                this.handleValue(msg as MLMsgFromAddSectionOption)
        })
    }

    protected override keyFromValue(value: MLMsgFromAddSectionOption): string {
        return value.section + "/" + value.name
    }
}
