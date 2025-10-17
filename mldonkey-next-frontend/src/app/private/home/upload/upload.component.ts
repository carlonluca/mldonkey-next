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

import { Component, inject, OnDestroy } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { faArrowDown, faArrowUp, faBed, faUpload } from '@fortawesome/free-solid-svg-icons'
import { interval } from 'rxjs'
import { COUNTRY_FLAG_URLS, MLCountryCode } from 'src/app/core/MLCountryCode'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLUtils } from 'src/app/core/MLUtils'
import { MLMsgFromClientInfo } from 'src/app/msg/MLMsgClientInfo'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { UploadsService } from 'src/app/services/uploads.service'

@Component({
    selector: 'app-upload',
    standalone: false,
    templateUrl: './upload.component.html',
    styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnDestroy {
    private uploadsService = inject(UploadsService)
    private subscriptions = new MLSubscriptionSet()
    
    dataSource = new MatTableDataSource<MLMsgFromClientInfo>([])
    dataSourcePending = new MatTableDataSource<MLMsgFromClientInfo>([])
    faUpload = faUpload
    faUp = faArrowUp
    faDown = faArrowDown
    faBed = faBed
    uiService = inject(UiServiceService)

    constructor() {
        this.subscriptions.add(
            this.uploadsService.currentClientInfo.observable.subscribe(() =>
                this.refreshUploading()
            )
        )
        this.subscriptions.add(
            this.uploadsService.currentUploadFiles.observable.subscribe(() =>
                this.refreshUploading()
            )
        )
        this.subscriptions.add(
            this.uploadsService.currentPendingFiles.observable.subscribe(() =>
                this.refreshPending()
            )
        )
        this.subscriptions.add(
            interval(5000).subscribe(() => this.uploadsService.requestRefresh())
        )

        this.refreshUploading()
        this.refreshPending()
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }

    protected refreshUploading() {
        if (!this.uploadsService.currentUploadFiles.value) {
            this.dataSource.data = []
            return
        }

        const clientIds = this.uploadsService.currentUploadFiles.value
        if (!clientIds) {
            this.dataSource.data = []
            return
        }

        const newUploads: MLMsgFromClientInfo[] = []
        for (const clientId of clientIds.clientNumbers) {
            const clientInfo = this.uploadsService.currentClientInfo.value.find(e =>
                e.clientId === clientId)
            if (!clientInfo)
                continue
            newUploads.push(clientInfo as MLMsgFromClientInfo)
        }

        this.dataSource.data = newUploads
    }

    protected refreshPending() {
        if (!this.uploadsService.currentPendingFiles.value) {
            this.dataSourcePending.data = []
            return
        }

        const clientIds = this.uploadsService.currentPendingFiles.value
        if (!clientIds) {
            this.dataSourcePending.data = []
            return
        }

        const newPending: MLMsgFromClientInfo[] = []
        for (const clientId of clientIds.clientNumbers) {
            const clientInfo = this.uploadsService.currentClientInfo.value.find(e =>
                e.clientId === clientId
            )
            if (!clientInfo)
                continue
            newPending.push(clientInfo as MLMsgFromClientInfo)
        }

        this.dataSourcePending.data = newPending
    }

    formatSize(size: bigint) {
        return MLUtils.beautifySize(size)
    }

    computeCountryCode(upload: MLMsgFromClientInfo): number {
        if (upload.clientKind.clientIp)
            return upload.clientKind.clientIp.countryCode        
        if (upload.clientKind.clientHostname)
            return upload.clientKind.clientHostname.countryCode
        return -1
    }

    computeAddress(upload: MLMsgFromClientInfo): string {
        if (upload.clientKind.clientIp)
            return this.computeIpString(upload.clientKind.clientIp.ip)
        if (upload.clientKind.clientHostname)
            return upload.clientKind.clientHostname.name
        return "-"
    }

    computeIpString(ipi: number): string {
        const part1 = ipi & 255
        const part2 = ((ipi >> 8) & 255)
        const part3 = ((ipi >> 16) & 255)
        const part4 = ((ipi >> 24) & 255)

        return part1 + "." + part2 + "." + part3 + "." + part4
    }

    getFlagSVG(upload: MLMsgFromClientInfo): string {
        const cc = this.computeCountryCode(upload)
        if (cc === -1)
            return ""

        const code = MLCountryCode.countryIndexToCode(cc)
        if (!code)
            return ""

        return COUNTRY_FLAG_URLS.get(code) ?? ""
    }
}
