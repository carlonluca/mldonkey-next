/*
 * This file is part of mldonkey-next.
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
import { MLMessageTypeFrom } from "../msg/MLMsg"
import { MLMsgFromFileDownloaded, MLMsgFromDownloadFile } from "../msg/MLMsgDownload"
import { MLMsgFromFileInfo } from "../msg/MLMsgFileInfo"
import { MLMsgDownloadElement } from "../data/MLDownloadFileInfo"

export class MLDownloadManager extends MLCollectionModel<number, MLMsgDownloadElement> {
    constructor(websocketService: WebSocketService) {
        super()
        websocketService.lastMessage.observable.subscribe(msg => {
            switch (msg.type) {
            case MLMessageTypeFrom.T_DOWNLOAD_FILES:
                (msg as MLMsgFromDownloadFile).elements.forEach((v) => this.handleValue(v))
                this.expireDownloads()
                break
            case MLMessageTypeFrom.T_FILE_DOWNLOADED: {
                const _msg = msg as MLMsgFromFileDownloaded
                const item = this.getWithKey(_msg.downloadId)
                if (!item)
                    return
                item.downloaded = _msg.downloaded
                this.expireDownloads()
                break
            }
            case MLMessageTypeFrom.T_FILE_INFO:
                this.handleValue((msg as MLMsgFromFileInfo).downloadElement)
                break
            }
        })
    }

    protected override keyFromValue(value: MLMsgDownloadElement): number {
        return value.downloadId
    }

    private expireDownloads() {
        for (const i of this.elements.value.values()) {
            if (i.downloaded >= i.size)
                this.removeWithKey(i.downloadId)
        }
    }
}
