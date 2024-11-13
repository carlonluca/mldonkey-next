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
import { MLMsgToGetStats, MLClientStat, MLSessionStatSet, MLMsgFromStats } from '../msg/MLMsgStats'
import { MLNetworkManager } from '../core/MLNetworkManager'
import { MLCollectionModel } from '../core/MLCollectionModel'
import { MLUPdateable } from '../core/MLUpdateable'

/*class MLClientStatCollection extends MLCollectionModel<string, MLClientStat> {
    protected override keyFromValue(value: MLClientStat): string {
        return value.clientDescriptionShort
    }
}

class MLSessionStatModel extends MLSessionStatSet implements MLUPdateable<MLSessionStatModel> {
    public statsModel: MLClientStatCollection

    update(update: MLSessionStatModel): void {
        this.name = update.name
        this.uptime = update.uptime
        this.stats = update.stats
        this.statsModel.update(update.statsModel)
    }
}

class MLSessionStatCollection extends MLCollectionModel<string, MLSessionStatModel> {
    protected override keyFromValue(value: MLSessionStatSet): string {
        return value.name
    }   
}*/

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

@Injectable({
    providedIn: 'root'
})
export class StatsService extends MLCollectionModel<number, MLNetworkStatModel> {
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
            })
        )
        this.subscriptions.add(
            interval(10000).subscribe(() => {
                this.refresh()
            })
        )
        this.refresh()
    }

    refresh() {
        this.websocketService.networkManager.elements.value.forEach(n => {
            this.websocketService.sendMsg(new MLMsgToGetStats(n.netNum))
        })
    }

    protected override keyFromValue(value: MLNetworkStatModel): number {
        return value.networkId
    }
}
