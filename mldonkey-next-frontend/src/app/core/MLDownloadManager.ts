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
 * Date: 2023.08.17
 */

import { WebSocketService } from "../websocket-service.service"
import { MLCollectionModel } from "./MLCollectionModel"
import { MLMessageTypeFrom } from "./MLMsg"
import { MLMsgDownloadElement, MLMsgFileDownloaded, MLMsgFromDownloadFile } from "./MLMsgDownload"
import { logger } from "./MLLogger"
import { MLMsgFromFileInfo } from "./MLMsgFileInfo"

export class MLDownloadManager extends MLCollectionModel<number, MLMsgDownloadElement> {
    constructor(websocketService: WebSocketService) {
        super()
        websocketService.lastMessage.observable.subscribe(msg => {
            switch (msg.type) {
            case MLMessageTypeFrom.T_DOWNLOAD_FILES:
                (msg as MLMsgFromDownloadFile).elements.forEach((v) => this.handleValue(v))
                break
            case MLMessageTypeFrom.T_FILE_DOWNLOADED:
                this.removeWithKey((msg as MLMsgFileDownloaded).downloadId)
                break
            case MLMessageTypeFrom.T_FILE_INFO:
                this.handleValue((msg as MLMsgFromFileInfo).downloadElement)
                break
            }

            this.elements.value.forEach((f) => {
                logger.warn(`STATE: ${f.state}`)
            })
        })
    }

    protected override keyFromValue(value: MLMsgDownloadElement): number {
        return value.downloadId
    }
}
