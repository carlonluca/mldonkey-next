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
            logger.warn("Client not registered")
            return
        }

        // TODO: dispose
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
