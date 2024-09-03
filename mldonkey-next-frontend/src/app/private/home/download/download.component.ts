/*
 * This file is part of mldonkey-next.
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
 * Date: 2023.11.05
 */
import { SelectionModel } from '@angular/cdk/collections'
import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core'
import { MatSort, MatSortable, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { interval } from 'rxjs'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLMsgDownloadElement } from 'src/app/data/MLDownloadFileInfo'
import { MLMsgToGetDownload } from 'src/app/msg/MLMsg'
import { MLMsgToRemoveDownload } from 'src/app/msg/MLMsgRemoveDownload'
import { MLSortMode } from '../../../core/MLSortMode'
import { DownloadingFilesService } from 'src/app/services/downloading-files.service'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { WebSocketService } from 'src/app/websocket-service.service'
import { faArrowDown, faPause } from '@fortawesome/free-solid-svg-icons'
import { StatsService } from 'src/app/services/stats.service'
import prettyBytes from 'pretty-bytes'
import { MLMsgFromClientStats } from 'src/app/msg/MLMsgClientStats'

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements AfterViewInit, OnInit, OnDestroy {
    dataSource = new MatTableDataSource<MLMsgDownloadElement>([])
    displayedColumns: string[] = this.displayColumns()
    selection = new SelectionModel<MLMsgDownloadElement>(true, []);
    selectionEnabled = false
    sortModes = [
        new MLSortMode("name", true, "Name (a → z)", true),
        new MLSortMode("name", false, "Name (z → a)"),
        new MLSortMode("downloaded", true, "Downloaded ↑"),
        new MLSortMode("downloaded", false, "Downloaded ↓"),
        new MLSortMode("size", true, "Size ↑"),
        new MLSortMode("size", false, "Size ↓"),
        new MLSortMode("speed", true, "Speed ↑"),
        new MLSortMode("speed", false, "Speed ↓")
    ]

    faPause = faPause
    faArrowDown = faArrowDown

    @ViewChild(MatSort) sort: MatSort

    private subscriptions = new MLSubscriptionSet()

    constructor(
        private websocketService: WebSocketService,
        private downloadingService: DownloadingFilesService,
        public clientStatsService: StatsService,
        public uiSerivce: UiServiceService
    ) { }

    ngOnInit() {
        this.subscriptions.add(this.uiSerivce.mobileLayout.observable.subscribe(() =>
            this.toggleSelectionEnabled()
        ))
        this.subscriptions.add(interval(1000).subscribe(() =>
            this.websocketService.sendMsg(new MLMsgToGetDownload()))
        );
        this.subscriptions.add(this.downloadingService.downloadingList.observable.subscribe((list) => {
            this.dataSource.data = list
            this.dataSource.sort = this.sort
            this.refreshSelection()
        }))
    }

    ngAfterViewInit() {
        this.sort.sort({ id: "name" } as MatSortable)
        this.dataSource.sort = this.sort
        this.dataSource.sortingDataAccessor = (item, prop) => {
            switch (prop) {
                case "size":
                    return Number(item.size / 1024n)
                case "name":
                    return item.name
                case "downloaded":
                    return Number(item.downloaded / 1024n)
                case "speed":
                    return Number(item.speed)
                default:
                    return 0
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe(null)
    }

    onSortChange(sortState: Sort) {
        this.sortModes.forEach(m => {
            if (!sortState) {
                m.selected = false
                return
            }

            if (sortState.active !== m.id) {
                m.selected = false
                return
            }

            if (sortState.direction === "asc" && m.asc) {
                m.selected = true
                return
            }

            if (sortState.direction === "desc" && !m.asc) {
                m.selected = true
                return
            }

            m.selected = false
        })
    }

    computeProgress(item: MLMsgDownloadElement): number {
        return Number(item.downloaded * 100n / item.size)
    }

    masterToggle() {
        if (this.isAllSelected())
            this.selection.clear()
        else
            this.dataSource.data.forEach(row => this.selection.select(row))
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    displayColumns(): string[] {
        if (this.uiSerivce.mobileLayout.value)
            return ['name']
        else
            return ['name', 'downloaded', 'size', 'speed']
    }

    toggleSelectionEnabled() {
        if (this.selectionEnabled)
            this.displayedColumns = ['select', ...this.displayColumns()]
        else
            this.displayedColumns = this.displayColumns()
    }

    cancelDownloads() {
        this.selection.selected.forEach((download) => {
            this.websocketService.sendMsg(new MLMsgToRemoveDownload(download.downloadId))
        })
    }

    refreshSelection() {
        const newArray: MLMsgDownloadElement[] = []
        this.selection.selected.forEach((item) => {
            if (this.dataSource.data.indexOf(item) >= 0)
                newArray.push(item)
        })

        this.selection = new SelectionModel(true, newArray)
    }

    sortModeClicked(sortMode: MLSortMode) {
        for (const sm of this.sortModes) {
            sm.selected = (sortMode == sm)
            if (sm.selected) {
                if (this.dataSource.sort) {
                    this.dataSource.sort.active = sm.id
                    this.dataSource.sort.direction = sm.asc ? "asc" : "desc"
                    this.dataSource.sort.sortChange.emit()
                }
            }
        }
    }

    displaySizeBytes(bytes: bigint | null | undefined) {
        if (bytes === null || bytes === undefined)
            return "?"
        return prettyBytes(Number(bytes))
    }

    displaySummary(stats: MLMsgFromClientStats | null): string {
        if (!stats)
            return `Upload: ? - Download: ?`

        const totUp = stats.tcpUpSpeed + stats.udpUpSpeed
        const totDown = stats.tcpDownSpeed + stats.udpDownSpeed
        return `Upload: ${prettyBytes(totUp)} - Download: ${prettyBytes(totDown)}`
    }

    displayDownloadSpeed(stats: MLMsgFromClientStats | null): string {
        if (!stats)
            return "?"
        const totDown = stats.tcpDownSpeed + stats.udpDownSpeed
        return prettyBytes(totDown) + "/s"
    }

    displayUploadSpeed(stats: MLMsgFromClientStats | null): string {
        if (!stats)
            return "?"
        const totUp = stats.tcpUpSpeed + stats.udpUpSpeed
        return prettyBytes(totUp) + "/s"
    }

    displaySpeedSafe(speed: number | null | undefined) {
        if (speed === null || speed === undefined)
            return "?"
        return prettyBytes(speed) + "/s"
    }
}
