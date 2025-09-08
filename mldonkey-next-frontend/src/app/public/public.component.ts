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
 * Date:    2023.08.14
 */

import { Component, OnDestroy, OnInit } from '@angular/core'
import { MLConnectionState, WebSocketService } from '../websocket-service.service'
import { SpinnerService } from '../services/spinner.service'
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from '../../environments/environment'
import { Credentials, StorageService } from '../services/storage.service'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { uiLogger } from '../core/MLLogger'
import { faUser, faKey, faLink, faLinkSlash } from '@fortawesome/free-solid-svg-icons'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { interval } from 'rxjs'
import { MLUtils } from '../core/MLUtils'
import { MatDialog } from '@angular/material/dialog'
import { AuthFailedComponent } from './auth-failed'

declare global {
    interface Window { location: Location; }
}

@Component({
    selector: 'app-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.scss'],
    standalone: false
})
export class PublicComponent implements OnInit, OnDestroy {
    private static readonly retryInterval = 7000
    private observables = new MLSubscriptionSet()
    private isEmbedded = environment.mldonkeyWsAddr.length <= 0
    private wsAddr = this.isEmbedded ? "localhost" : environment.mldonkeyWsAddr
    private wsPort = this.isEmbedded ? 4002 : environment.mldonkeyWsPort
    private wsPath = this.isEmbedded ? "" : environment.mldonkeyWsPath
    private wsScheme = this.isEmbedded ? "ws://"
        : (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
    private wsUrl = isNaN(this.wsPort) ? `${this.wsScheme}${this.wsAddr}${this.wsPath}`
        : `${this.wsScheme}${this.wsAddr}:${this.wsPort}${this.wsPath}`
    private runningTimer: any = null

    faUser = faUser
    faKey = faKey
    faConnected = faLink
    faDisconnected = faLinkSlash
    connected = false
    inputUsr = ""
    inputPwd = ""

    /**
     * Ctor.
     * 
     * @param webSocketService 
     */
    constructor(
        private webSocketService: WebSocketService,
        private spinner: SpinnerService,
        private router: Router,
        private route: ActivatedRoute,
        private storage: StorageService,
        private dialog: MatDialog) {

        const loginData = storage.getLoginData()
        if (loginData) {
            this.inputUsr = loginData.username
            this.inputPwd = loginData.passwd ?? ""
        }

        webSocketService.connectionState.observable.subscribe(state => {
            switch (state) {
                case MLConnectionState.S_AUTHENTICATED:
                    this.storage.setLoginData(new Credentials(this.inputUsr, this.inputPwd))
                    this.connected = true
                    this.spinner.hide()
                    if (this.runningTimer)
                        window.clearTimeout(this.runningTimer)
                    this.router.navigateByUrl("/home")
                    break
                case MLConnectionState.S_CONNECTED: {
                    this.connected = true
                    const data = this.storage.getLoginData()
                    if (data) {
                        this.spinner.show()

                        // Apparently mldonkey returns "bad credentials" if login is run too soon.
                        setTimeout(() => {
                            if (data) {
                                uiLogger.info("Credentials found in storage. Logging in automatically...")
                                this.doLogin(data.username, data.passwd ?? "")
                            }
                        }, 1000)
                    }
                    break
                }
                default:
                    this.connected = false
                    this.spinner.hide()
                    break
            }
        })
        webSocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type === MLMessageTypeFrom.T_BAD_PASSWORD)
                this.failure()
        })

        this.webSocketService.connect(this.wsUrl)
    }

    ngOnInit(): void {
        this.observables.add(
            interval(PublicComponent.retryInterval).subscribe(() => {
                if (this.connected)
                    return
                this.webSocketService.disconnect()
                this.webSocketService.connect(this.wsUrl)
            })
        )
    }

    ngOnDestroy(): void {
        this.observables.unsubscribe(null)
    }

    /**
     * Tries to login.
     */
    login() {
        this.doLogin(this.inputUsr, this.inputPwd)
    }

    /**
     * Logs in with the provided credentials.
     * 
     * @param username 
     * @param passwd 
     */
    doLogin(username: string, passwd: string) {
        this.spinner.show()
        this.webSocketService.login(username, passwd)
        this.runningTimer = setTimeout(() => {
            this.failure()
        }, 5000)
    }

    doSetup() {
        const newParam = { action: 'openSetup' }
        MLUtils.signalToNative(this.router, this.route, newParam)
    }

    isWebView(): boolean {
        return MLUtils.isWebView()
    }

    closeDialog() {
        this.dialog.closeAll()
    }

    openDialog() {
        if (this.dialog.openDialogs.length === 0)
            this.dialog.open(AuthFailedComponent)
    }

    failure() {
        if (this.runningTimer)
            window.clearTimeout(this.runningTimer)
        this.storage.setLoginData(null)
        this.spinner.hide()
        this.openDialog()
        this.webSocketService.disconnect()
    }
}
