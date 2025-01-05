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
 * Date:    2023.12.03
 */

import { SelectionModel } from '@angular/cdk/collections'
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatSort, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLUtils } from 'src/app/core/MLUtils'
import { MLAddrIp, MLAddrName, MLAddrType } from 'src/app/msg/MLAddr'
import { MLHostConnState, MLHostState } from 'src/app/msg/MLHostState'
import { MLMsgFromServerInfo } from 'src/app/msg/MLMsgServer'
import { ServersService } from 'src/app/services/servers.service'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { WebSocketService } from 'src/app/websocket-service.service'

@Component({
    selector: 'app-servers',
    templateUrl: './servers.component.html',
    styleUrls: ['./servers.component.scss'],
    standalone: false
})
export class ServersComponent implements OnInit, OnDestroy {
    private subscriptions = new MLSubscriptionSet()

    @ViewChild(MatSort) sort: MatSort

    dataSource = new MatTableDataSource<MLMsgFromServerInfo>([])
    selection = new SelectionModel<MLMsgFromServerInfo>(true, [])
    selectionEnabled = false
    displayedColumns: string[] = this.displayColumns()

    constructor(
        public websocketService: WebSocketService,
        public uiService: UiServiceService,
        public serversService: ServersService
    ) { }

    ngOnInit(): void {
        this.subscriptions.add(
            this.uiService.mobileLayout.observable.subscribe(() => {
                this.refreshColumns()
            })
        )
        this.subscriptions.add(
            this.serversService.serverList.observable.subscribe((list) => {
                this.dataSource.data = list
                this.dataSource.sort = this.sort
                this.refreshSelection()
            })
        )

        this.dataSource.data = this.serversService.serverList.value
        this.dataSource.sort = this.sort
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }

    onSortChange(_sortState: Sort) {
    }

    masterToggle() {

    }

    isAllSelected(): boolean {
        return false
    }

    displayColumns(): string[] {
        if (this.uiService.mobileLayout.value)
            return ['name']
        else
            return ['name', 'addr', 'status']
    }

    refreshColumns() {
        if (this.selectionEnabled)
            this.displayedColumns = ['select', ...this.displayColumns()]
        else
            this.displayedColumns = this.displayColumns()
    }

    refreshSelection() {
        const newArray: MLMsgFromServerInfo[] = []
        this.selection.selected.forEach((item) => {
            if (this.dataSource.data.indexOf(item) >= 0)
                newArray.push(item)
        })

        this.selection = new SelectionModel(true, newArray)
    }

    buildAddress(serverInfo: MLMsgFromServerInfo) {
        if (!serverInfo.inetAddr)
            return "-"
        const inetAddr = serverInfo.inetAddr
        if (inetAddr.addrType == MLAddrType.A_T_IP) {
            const ip = inetAddr as MLAddrIp
            const ipstring = MLUtils.int32ToIPv4(ip.addrIp)
            return `${ipstring}:${serverInfo.serverPort}`
        }
        else {
            const name = inetAddr as MLAddrName
            return name.nameAddr
        }
    }

    getHostConnStateDescription(state: MLHostConnState | undefined): string {
        if (!state)
            return "-"
        return MLHostState.getHostConnStateDescription(state)
    }
}
