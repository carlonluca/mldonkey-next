/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2025 Luca Carlon
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
 * Date:    2025.05.26
 */

import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLSearchInfo } from 'src/app/data/MLSearchInfo'
import { SearchesService } from 'src/app/services/searches.service'

@Component({
    selector: 'app-search-history',
    templateUrl: './search-history.component.html',
    styleUrl: './search-history.component.scss',
    standalone: false
})
export class SearchHistoryComponent implements OnInit, OnDestroy {
    private searchesService = inject(SearchesService)

    dataSource = new MatTableDataSource<MLSearchInfo>([])
    subscriptions = new MLSubscriptionSet()

    constructor() { }

    ngOnInit(): void {
        this.searchesService.searchManager.registerListener()
        this.subscriptions.add(
            this.searchesService.searchManager.elements.observable.subscribe(msg => {
                this.refreshModel(msg)
            })
        )
        this.refreshModel(this.searchesService.searchManager.elements.value)
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
        this.searchesService.searchManager.unregisterListener()
    }

    private refreshModel(searches: Map<number, MLSearchInfo>) {
        this.dataSource.data = [...searches.keys()].sort().filter(e =>
            !!searches.get(e)
        ).map(e => searches.get(e) as MLSearchInfo)
    }
}
