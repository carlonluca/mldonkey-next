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
 * Date: 14.08.2023
 */
import { Component, VERSION, ViewChild, inject } from '@angular/core'
import { Router } from '@angular/router'
import {
    faDownload,
    faMagnifyingGlass,
    faServer,
    faChartSimple,
    faGears,
    faDoorOpen,
    faComputer,
    faFileLines,
    faUpload,
    faChartPie,
    faCircleInfo,
    faTerminal,
    faQuestion,
    faShareNodes,
    faClockRotateLeft
} from '@fortawesome/free-solid-svg-icons'
import { StorageService } from 'src/app/services/storage.service'
import { MLConnectionState, WebSocketService } from 'src/app/websocket-service.service'
import packageJson from '../../../../package.json'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { OptionsService } from 'src/app/services/options.service'
import { ConsoleService } from 'src/app/services/console.service'
import { SysinfoService } from 'src/app/services/sysinfo.service'
import { MatSidenav } from '@angular/material/sidenav'
import { ClientStatsService } from 'src/app/services/clientstats.service'
import { StatsService } from 'src/app/services/stats.service'
import { MatDialog } from '@angular/material/dialog'
import { AboutComponent } from './about/about.component'
import { ServersService } from 'src/app/services/servers.service'
import { SharedFilesinfoService } from 'src/app/services/sharedfilesinfo.service'
import { SearchesService } from 'src/app/services/searches.service'
import { UploadsService } from 'src/app/services/uploads.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent {
    private webSocketService = inject(WebSocketService)
    private router = inject(Router)
    private storage = inject(StorageService)
    private optionService = inject(OptionsService)
    private consoleService = inject(ConsoleService)
    private sysInfoService = inject(SysinfoService)
    private clientStatsService = inject(ClientStatsService)
    private statsService = inject(StatsService)
    private serverService = inject(ServersService)
    private sharedFileInfoService = inject(SharedFilesinfoService)
    private searchesService = inject(SearchesService)
    private uploadService = inject(UploadsService)
    uiService = inject(UiServiceService)
    dialog = inject(MatDialog)

    @ViewChild(MatSidenav) sidenav: MatSidenav;

    private subscriptions = new MLSubscriptionSet()

    opened = true
    faDownload = faDownload
    faUpload = faUpload
    faMagnifyingGlass = faMagnifyingGlass
    faServer = faServer
    faChartSimple = faChartSimple
    faGears = faGears
    faDoorOpen = faDoorOpen
    faTerminal = faTerminal
    faComputer = faComputer
    faFileLines = faFileLines
    faQuestion = faQuestion
    faPie = faChartPie
    faCircleInfo = faCircleInfo
    faShareNodes = faShareNodes
    faClockRotateLeft = faClockRotateLeft
    version = packageJson.version
    versionAngular = VERSION

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor() {
        this.subscriptions.add(
            this.uiService.mobileLayout.observable.subscribe(() => this.refreshOpenedState())
        )
        this.refreshOpenedState()

        this.subscriptions.add(
            this.webSocketService.connectionState.observable.subscribe(state => this.handleState(state))
        )
        this.handleState(this.webSocketService.connectionState.value)
    }

    logout() {
        this.storage.setLoginData(null)
        this.webSocketService.disconnect()
        this.router.navigate(["/"])
    }

    refreshOpenedState() {
        this.opened = !this.uiService.mobileLayout.value
    }

    handleState(state: MLConnectionState) {
        if (state == MLConnectionState.S_NOT_CONNECTED) {
            this.router.navigate(["/"])
        }
    }

    openAbout() {
        this.dialog.open(AboutComponent, {})
    }
}
