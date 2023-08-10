import { Component, OnInit } from '@angular/core'
import { MLConnectionState, WebSocketService } from '../websocket-service.service'
import { SpinnerService } from '../services/spinner.service'
import { MLMessageTypeFrom } from '../core/MLMessage'
import { Router } from '@angular/router'

@Component({
    selector: 'app-public',
    templateUrl: './public.component.html',
    styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {
    connected: Boolean = false
    inputUsr: string = ""
    inputPwd: string = ""

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

    ngOnInit() { }

    /**
     * Tries to login.
     */
    login() {
        // TODO: introduce some kind of timeout here
        this.spinner.show()
        this.webSocketService.login(this.inputUsr, this.inputPwd)
    }
}