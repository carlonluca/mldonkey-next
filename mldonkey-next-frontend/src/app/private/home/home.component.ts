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
import { Component, OnInit, VERSION } from '@angular/core'
import { Router } from '@angular/router'
import {
    faDownload,
    faMagnifyingGlass,
    faServer,
    faChartSimple,
    faGears,
    faDoorOpen,
    faMessage
} from '@fortawesome/free-solid-svg-icons'
import { StorageService } from 'src/app/services/storage.service'
import { WebSocketService } from 'src/app/websocket-service.service'
import packageJson from '../../../../package.json'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { OptionsService } from 'src/app/services/options.service'
import { ConsoleService } from 'src/app/services/console.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private subscriptions = new MLSubscriptionSet()

    opened = true
    faDownload = faDownload
    faMagnifyingGlass = faMagnifyingGlass
    faServer = faServer
    faChartSimple = faChartSimple
    faGears = faGears
    faDoorOpen = faDoorOpen
    faMessage = faMessage
    version = packageJson.version
    versionAngular = VERSION

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(
        private webSocketService: WebSocketService,
        private router: Router,
        private storage: StorageService,
        private optionService: OptionsService,
        private consoleService: ConsoleService,
        public uiService: UiServiceService) {
        this.subscriptions.add(
            this.uiService.mobileLayout.observable.subscribe(() => this.refreshOpenedState())
        )
        this.refreshOpenedState()
    }

    logout() {
        this.storage.setLoginData(null)
        this.webSocketService.disconnect()
        this.router.navigate(["/"])
    }

    refreshOpenedState() {
        this.opened = !this.uiService.mobileLayout.value
    }
}
