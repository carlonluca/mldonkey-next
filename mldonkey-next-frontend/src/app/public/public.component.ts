/*
 * This file is part of mldonket-next.
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

import { Component } from '@angular/core'
import { MLConnectionState, WebSocketService } from '../websocket-service.service'
import { SpinnerService } from '../services/spinner.service'
import { Router } from '@angular/router'

@Component({
    selector: 'app-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.scss']
})
export class PublicComponent {
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
        private router: Router) {
        webSocketService.connectionState.observable.subscribe(state => {
            switch (state) {
                case MLConnectionState.S_AUTHENTICATED:
                    this.connected = true
                    this.spinner.hide()
                    this.router.navigateByUrl("/home")
                    break
                case MLConnectionState.S_CONNECTED:
                    this.connected = true
                    break
                default:
                    this.connected = false
                    break
            }
        })

        this.webSocketService.connect(`ws://${window.location.hostname}:8080`)
    }

    /**
     * Tries to login.
     */
    login() {
        // TODO: introduce some kind of timeout here
        this.spinner.show()
        this.webSocketService.login(this.inputUsr, this.inputPwd)
    }
}
