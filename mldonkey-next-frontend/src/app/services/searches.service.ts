import { Injectable } from '@angular/core'
import { WebSocketService } from '../websocket-service.service'
import { MLResultInfoManager } from '../core/MLResultInfoManager'
import { MLSearchResult } from '../data/MLSearchResult'
import { MLMessageTypeFrom } from '../msg/MLMsg'
import { MLMsgFromSearchResult } from '../msg/MLMsgQuery'
import { MLSearchResultManager } from '../core/MLSearchResultManager'
import { MLSearchInfoManager } from '../core/MLSearchInfoManager'

@Injectable({
    providedIn: 'root'
})
export class SearchesService {
    public searchManager: MLSearchInfoManager
    public resultManager: MLResultInfoManager
    public searchResultManager: MLSearchResultManager
    public matches: Array<MLSearchResult> = new Array<MLSearchResult>()

    constructor(public websocketService: WebSocketService) {
        this.websocketService.lastMessage.observable.subscribe((msg) => {
            if (msg.type === MLMessageTypeFrom.T_SEARCH_RESULT) {
                this.matches.push((msg as MLMsgFromSearchResult).content)
                this.refreshResults()
            }
        })

        this.searchManager = new MLSearchInfoManager(websocketService)
        this.resultManager = new MLResultInfoManager(websocketService)
        this.searchResultManager = new MLSearchResultManager(websocketService)

        this.searchManager.elements.observable.subscribe(() => this.refreshResults())
        this.resultManager.elements.observable.subscribe(() => this.refreshResults())
    }

    private refreshResults() {
        // List searches
        this.searchManager.elements.value
    }
}
