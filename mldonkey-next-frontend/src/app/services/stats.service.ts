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

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2024.11.10
 */

import { Injectable } from '@angular/core'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { WebSocketService } from '../websocket-service.service'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { interval } from 'rxjs'
import { MLMsgToGetStats, MLSessionStatSet, MLMsgFromStats } from '../msg/MLMsgStats'
import { MLCollectionModel } from '../core/MLCollectionModel'
import { MLUPdateable } from '../core/MLUpdateable'
import { MLObservableVariable } from '../core/MLObservableVariable'

class MLNetworkStatModel implements MLUPdateable<MLNetworkStatModel> {
    constructor(
        public networkId: number,
        public sessionStats: MLSessionStatSet[]
    ) {}
    
    update(update: MLNetworkStatModel): void {
        this.networkId = update.networkId
        this.sessionStats = update.sessionStats
    }
}

export class MLNetworkSummaryModel {
    constructor(
        public networkNum: number,
        public networkName: string,
        public enabled: boolean,
        public uptimeSecs: number,
        public uptimePerc: number,
        public requests: number,
        public requestsPerc: number,
        public banned: number,
        public bannedPerc: number,
        public uploadedBytes: number,
        public uploadedPerc: number,
        public downloadedBytes: number,
        public downloadedPerc: number
    ) {}
}

@Injectable({
    providedIn: 'root'
})
export class StatsService extends MLCollectionModel<number, MLNetworkStatModel> {
    public byNetworkStats = new MLObservableVariable<MLNetworkSummaryModel[]>([])
    private subscriptions = new MLSubscriptionSet()
    
    constructor(private websocketService: WebSocketService) {
        super()
        this.subscriptions.add(
            this.websocketService.lastMessage.observable.subscribe(m => {
                if (m.type !== MLMessageTypeFrom.T_STATS)
                    return
                const msg = m as MLMsgFromStats
                msg.stats.forEach(sessionStat => {
                    sessionStat.stats?.sort((a, b) => a.clientDescriptionLong.localeCompare(b.clientDescriptionLong))
                })
                msg.stats.sort((a, b) => a.name.localeCompare(b.name))
                this.handleValue(new MLNetworkStatModel(msg.networkId, msg.stats))
                this.refreshStats()
            })
        )
        this.subscriptions.add(
            interval(10000).subscribe(() => {
                this.refresh()
            })
        )
        this.refresh()
        this.refreshStats()
    }

    refresh() {
        this.websocketService.networkManager.elements.value.forEach(n => {
            this.websocketService.sendMsg(new MLMsgToGetStats(n.netNum))
        })
    }

    refreshStats() {
        let totalUptime = 0
        this.elements.value.forEach((netStatModel, _netNum) => {
            netStatModel.sessionStats.forEach(sessionStats => {
                if (sessionStats.name.toUpperCase().includes("GLOBAL")) {
                    totalUptime += sessionStats.uptime
                }
            })
        })

        const summary: MLNetworkSummaryModel[] = []
        this.elements.value.forEach((netStatModel, netNum) => {
            netStatModel.sessionStats.forEach(sessionStats => {
                if (sessionStats.name.toUpperCase().includes("GLOBAL")) {
                    const netInfo = this.websocketService.networkManager.getWithKey(netNum)
                    if (!netInfo)
                        return
                    const summaryModel = new MLNetworkSummaryModel(
                        netNum,
                        netInfo.name,
                        netInfo.enabled,
                        sessionStats.uptime,
                        totalUptime === 0 ? 0 : sessionStats.uptime/totalUptime,
                        0, 0, 0, 0, 0, 0, 0, 0
                    )
                    summary.push(summaryModel)
                }
            })
        })

        this.websocketService.networkManager.elements.value.forEach(n => {
            if (!summary.find(v => v.networkNum == n.netNum)) {
                summary.push(new MLNetworkSummaryModel(
                    n.netNum,
                    n.name,
                    n.enabled,
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ))
            }
        })

        summary.sort((a, b) => a.networkNum - b.networkNum)

        this.byNetworkStats.observable.next(summary)
    }

    protected override keyFromValue(value: MLNetworkStatModel): number {
        return value.networkId
    }
}
