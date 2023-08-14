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
import { interval } from 'rxjs'
import { logger } from 'src/app/core/MLLogger'
import { MLMsgToGetDownload } from 'src/app/core/MLMsg'
import { MLMsgConsole } from 'src/app/core/MLMsgConsole'
import { MLMessageFromNetInfo } from 'src/app/core/MLMsgNetInfo'
import { WebSocketService } from 'src/app/websocket-service.service'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    constructor(private websocketService: WebSocketService) {
        websocketService.lastMessage.observable.subscribe(msg => {
            if (msg instanceof MLMessageFromNetInfo) {
                logger.debug("Net info:", msg.name, msg.configFile, msg.connected, msg.flags)
            }
            else if (msg instanceof MLMsgConsole) {
                logger.debug("Console:", msg.command)
            }
        })
        interval(1000).subscribe(() => websocketService.sendMsg(new MLMsgToGetDownload()))
    }
}
