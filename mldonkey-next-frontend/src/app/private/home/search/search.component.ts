import { Component, OnInit } from '@angular/core'
import { WebSocketService } from 'src/app/websocket-service.service'
import {
    MLMsgToGetSearch,
    MLMsgToGetSearches,
    MLMsgToQuery,
    MLQueryNode
} from 'src/app/msg/MLMsgQuery'
import { SearchesService } from 'src/app/services/searches.service'
import { logger } from 'src/app/core/MLLogger'
import { MLSearchInfo } from 'src/app/data/MLSearchInfo'
import { MLSearchSessionManager } from 'src/app/core/MLSearchSessionManager'
import { MatTableDataSource } from '@angular/material/table'
import { MLResultInfo } from 'src/app/data/MLResultInfo'
import { MLDownloadMethod, MLMsgToDownload } from 'src/app/msg/MLMsgDownload'
import { MLTagIn8, MLTagType } from 'src/app/msg/MLtag'

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
    dataSource = new MatTableDataSource<MLResultInfo>([])
    displayedColumns: string[] = ['availability', 'name', 'size']
    searchText = ''
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
        for (const key of this.searchService.searchManager.elements.value.keys()) {
            if (maxKey === undefined || key > maxKey) {
                maxKey = key
            }
        }
        if (maxKey === undefined)
            maxKey = 0

        this.currentSearchId = maxKey + 1
        this.currentSearchResults.setSearchId(this.currentSearchId)

        this.websocketService.sendMsg(new MLMsgToQuery(this.currentSearchId, MLQueryNode.fromString(this.searchText)))
        this.websocketService.sendMsg(new MLMsgToGetSearch(this.currentSearchId))
    }

    extractAvailability(result: MLResultInfo): number {
        const availabilityTag = result.fileMetadata.get("availability")
        if (!availabilityTag || availabilityTag.type !== MLTagType.T_SINT8)
            return 0
        return (availabilityTag as MLTagIn8).value
    }

    rowClicked(resultInfo: MLResultInfo) {
        logger.info("Download:", resultInfo.fileNames)
        const msg = new MLMsgToDownload(resultInfo.fileNames, resultInfo.id, MLDownloadMethod.M_FORCE)
        this.websocketService.sendMsg(msg)
    }
}
