import { Component, OnInit } from '@angular/core'
import { WebSocketService } from 'src/app/websocket-service.service'
import {
    MLMsgToGetSearches,
    MLMsgToQuery
} from 'src/app/msg/MLMsgQuery'
import { SearchesService } from 'src/app/services/searches.service'
import { logger } from 'src/app/core/MLLogger'
import { MLSearchInfo } from 'src/app/data/MLSearchInfo'
import { MLSearchSessionManager } from 'src/app/core/MLSearchSessionManager'
import { MatTableDataSource } from '@angular/material/table'
import { MLResultInfo } from 'src/app/data/MLResultInfo'

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    dataSource = new MatTableDataSource<MLResultInfo>([])
    displayedColumns: string[] = ['name', 'size']
    searchText: string = ''
    currentSearchId = -1
    currentSearch: MLSearchInfo | null = null
    currentSearchResults: MLSearchSessionManager

    constructor(
        private websocketService: WebSocketService,
        private searchService: SearchesService
        ) {
            this.currentSearchResults = new MLSearchSessionManager(
                -1,
                searchService.searchManager,
                searchService.resultManager,
                searchService.searchResultManager
            )
            this.currentSearchResults.elements.observable.subscribe((list) => {
                this.dataSource.data = list
            })
        }

    ngOnInit(): void {
        this.websocketService.sendMsg(new MLMsgToGetSearches())
    }

    search() {
        logger.info(`Searching for ${this.searchText}`)
        let maxKey: number | undefined;
        for (let key of this.searchService.searchManager.elements.value.keys()) {
            if (maxKey === undefined || key > maxKey) {
                maxKey = key
            }
        }
        if (maxKey === undefined)
            maxKey = 0

        this.currentSearchId = maxKey + 1
        this.currentSearchResults.setSearchId(this.currentSearchId)

        this.websocketService.sendMsg(new MLMsgToQuery(this.currentSearchId, this.searchText)) 
    }
}
