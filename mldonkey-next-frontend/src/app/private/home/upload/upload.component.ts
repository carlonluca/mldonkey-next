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
 * Date:    2025.10.07
 */

import { Component, inject } from '@angular/core'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLMsgFromClientInfo } from 'src/app/msg/MLMsgClientInfo'
import { UploadsService } from 'src/app/services/uploads.service'

export class MLUpload {
    constructor(
        public clientId: number,
        public clientInfo: MLMsgFromClientInfo
    ) {}
}

@Component({
    selector: 'app-upload',
    standalone: false,
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss'
})
export class UploadComponent {
    private uploadsService = inject(UploadsService)
    public uploadsModel: MLUpload[] = []
    private subscriptions = new MLSubscriptionSet()

    constructor() {
        this.subscriptions.add(
            this.uploadsService.currentClientInfo.observable.subscribe(() => this.refresh())
        )
        this.subscriptions.add(
            this.uploadsService.currentUploadFiles.observable.subscribe(() => this.refresh())
        )

        this.refresh()
    }

    protected refresh() {
        if (this.uploadsService.currentUploadFiles.value === null) {
            this.uploadsModel = []
            return
        }

        const clientIds = this.uploadsService.currentUploadFiles.value
        if (clientIds === null) {
            this.uploadsModel = []
            return
        }

        const newUploads: MLUpload[] = []
        for (const clientId of clientIds.clientNumbers) {
            const clientInfo = this.uploadsService.currentClientInfo.value.find(e =>
                e.clientId === clientId)
            if (!clientInfo)
                continue
            newUploads.push(new MLUpload(clientId, clientInfo as MLMsgFromClientInfo))
        }

        this.uploadsModel = newUploads
    }
}
