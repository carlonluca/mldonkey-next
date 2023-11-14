import { Injectable } from '@angular/core';
import { MLSearchManager } from '../core/MLSearchManager';
import { WebSocketService } from '../websocket-service.service';

@Injectable({
    providedIn: 'root'
})
export class SearchesService {
    public searchManager: MLSearchManager

    constructor(public websocketService: WebSocketService) {
        this.searchManager = new MLSearchManager(websocketService)
    }
}
