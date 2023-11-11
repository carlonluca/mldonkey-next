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
 * Date:    2023.08.06
 * Company: -
 */

import { MLBridge } from "./MLBridge"
import { logger } from "./MLLogger"
import WebSocket from 'ws'

export class MLBridgeManager {
    /**
     * Adds a new working connection from a client.
     * 
     * @param websocket 
     * @returns 
     */
    public clientConnected(websocket: WebSocket) {
        if (this.connections.has(websocket)) {
            logger.warn("Client already registered")
            return
        }

        this.connections.set(websocket, new MLBridge(websocket))
        this.logClientsConnected()
    }

    /**
     * Removes a connection to a client as a result of a disconnection or
     * of an error.
     * 
     * @param websocket 
     */
    public clientDisconnected(websocket: WebSocket) {
        const bridge = this.connections.get(websocket)
        if (!bridge) {
            logger.warn(`Client not registered ${websocket}`)
            return
        }

        bridge.dispose()
        this.connections.delete(websocket)
        this.logClientsConnected()
    }

    /**
     * Logs the currently monitored clients in the manager.
     */
    private logClientsConnected() {
        logger.verbose(`Clients still connected: ${this.connections.size}`)
    }

    public connections: Map<WebSocket, MLBridge> = new Map()
}
