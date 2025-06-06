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
    private wsAddr = environment.mldonkeyWsAddr.length <= 0 ? "localhost" : environment.mldonkeyWsAddr
    private wsUrl = `ws://${this.wsAddr}:${environment.mldonkeyWsPort}`

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
        private storage: StorageService) {

        const loginData = storage.getLoginData()
        if (loginData) {
            this.inputUsr = loginData.username
            this.inputPwd = loginData.passwd ?? ""
        }

        webSocketService.connectionState.observable.subscribe(state => {
            switch (state) {
                case MLConnectionState.S_AUTHENTICATED:
                    this.connected = true
                    this.spinner.hide()
                    this.router.navigateByUrl("/home")
                    this.storage.setLoginData(new Credentials(this.inputUsr, this.inputPwd))
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
                    break
            }
        })
        webSocketService.lastMessage.observable.subscribe(msg => {
            if (msg.type === MLMessageTypeFrom.T_BAD_PASSWORD)
                this.storage.setLoginData(null)
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
        // TODO: introduce some kind of timeout here
        this.spinner.show()
        this.webSocketService.login(username, passwd)
    }

    doSetup() {
        const newParam = { action: 'openSetup' }
        MLUtils.signalToNative(this.router, this.route, newParam)
    }

    isWebView(): boolean {
        return MLUtils.isWebView()
    }
}
