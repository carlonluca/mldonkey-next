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
 * Date:    2023.11.19
 */
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { WebSocketService } from 'src/app/websocket-service.service'
import { SearchesService } from 'src/app/services/searches.service'
import { logger } from 'src/app/core/MLLogger'
import { MLSearchInfo } from 'src/app/data/MLSearchInfo'
import { MLSearchSessionManager } from 'src/app/core/MLSearchSessionManager'
import { MatTableDataSource } from '@angular/material/table'
import { MLResultInfo } from 'src/app/data/MLResultInfo'
import { MLDownloadMethod, MLMsgToDownload } from 'src/app/msg/MLMsgDownload'
import { MLTagIn8, MLTagType, MLTagUint32 } from 'src/app/msg/MLtag'
import { MatSort, MatSortable } from '@angular/material/sort'
import {
    MLMsgToGetSearch,
    MLMsgToGetSearches,
    MLMsgToQuery,
    MLQueryNode
} from 'src/app/msg/MLMsgQuery'

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements AfterViewInit, OnInit {
    dataSource = new MatTableDataSource<MLResultInfo>([])
    displayedColumns: string[] = ['availability', "completesources", 'name', 'size']
    searchText = ''
    currentSearchId = -1
    currentSearch: MLSearchInfo | null = null
    currentSearchResults: MLSearchSessionManager

    @ViewChild(MatSort) sort: MatSort

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
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
        this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
            case "availability":
                return this.stringifyAvailability(item)
            case "completesources":
                return this.stringifyCompleteSources(item)
            case "name":
                return item.fileNames[0]
            case "size":
                return Number(item.fileSize / 1024n)
            default:
                return ""
            }
        }
        this.sort.sort({ id: "fileSize" } as MatSortable)
    }

    ngOnInit(): void {
        this.websocketService.sendMsg(new MLMsgToGetSearches())
        this.currentSearchResults.elements.observable.subscribe((list) => {
            this.dataSource.data = list
            this.dataSource.sort = this.sort
        })
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

        const query = MLQueryNode.fromString(this.searchText)
        if (!query)
            return
        this.websocketService.sendMsg(new MLMsgToQuery(this.currentSearchId, query))
        this.websocketService.sendMsg(new MLMsgToGetSearch(this.currentSearchId))
    }

    stringifyAvailability(result: MLResultInfo): number {
        const availabilityTag = result.fileMetadata.get("availability")
        if (!availabilityTag || availabilityTag.type !== MLTagType.T_SINT8)
            return 0
        return (availabilityTag as MLTagIn8).value
    }

    stringifyCompleteSources(result: MLResultInfo): number {
        const csourcesTag = result.fileMetadata.get("completesources")
        if (!csourcesTag || csourcesTag.type !== MLTagType.T_UINT32)
            return 0
        return (csourcesTag as MLTagUint32).value
    }

    rowClicked(resultInfo: MLResultInfo) {
        logger.info("Download:", resultInfo.fileNames)
        const msg = new MLMsgToDownload(resultInfo.fileNames, resultInfo.id, MLDownloadMethod.M_FORCE)
        this.websocketService.sendMsg(msg)
    }
}
