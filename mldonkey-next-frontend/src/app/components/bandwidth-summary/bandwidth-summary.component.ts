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

import { Component, inject, OnDestroy, OnInit } from '@angular/core'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLMsgFromClientStats } from 'src/app/msg/MLMsgClientStats'
import { ClientStatsService } from 'src/app/services/clientstats.service'
import { UploadsService } from 'src/app/services/uploads.service'

@Component({
    selector: 'app-bandwidth-summary',
    templateUrl: './bandwidth-summary.component.html',
    styleUrl: './bandwidth-summary.component.scss',
    standalone: false
})
export class BandwidthSummaryComponent implements OnInit, OnDestroy {
    private subscriptions = new MLSubscriptionSet()
    
    clientStatsService = inject(ClientStatsService)
    uploadsService = inject(UploadsService)
    downSpeed: number | null = null
    upSpeed: number | null = null
    faUp = faArrowUp
    faDown = faArrowDown

    ngOnInit(): void {
        this.subscriptions.add(
            this.clientStatsService.stats.observable.subscribe(stats => {
                this.refreshStats(stats)
            })
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }

    private refreshStats(stats: MLMsgFromClientStats | null) {
        if (!stats) {
            this.downSpeed = null
            this.upSpeed = null
        }
        else {
            const totDown = stats.tcpDownSpeed + stats.udpDownSpeed
            const totUp = stats.tcpUpSpeed + stats.udpUpSpeed
            this.downSpeed = totDown
            this.upSpeed = totUp
        }
    }
}
