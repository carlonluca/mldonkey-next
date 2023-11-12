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
 * Date: 2023.11.05
 */
import { Component, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { interval } from 'rxjs';
import { MLMsgToGetDownload } from 'src/app/core/MLMsg';
import { MLMsgDownloadElement } from 'src/app/core/MLMsgDownload';
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet';
import { DownloadingFilesService } from 'src/app/services/downloading-files.service';
import { WebSocketService } from 'src/app/websocket-service.service';

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements AfterViewInit, OnInit, OnDestroy {
    dataSource = new MatTableDataSource<MLMsgDownloadElement>([])
    displayedColumns: string[] = ['name', 'size']

    @ViewChild(MatSort) sort: MatSort

    private subscriptions = new MLSubscriptionSet()

    constructor(private websocketService: WebSocketService, private downloadingService: DownloadingFilesService) {}

    ngOnInit() {
        this.websocketService.sendMsg(new MLMsgToGetDownload())
        //this.subscriptions.add(interval(1000).subscribe(() =>
        //    this.websocketService.sendMsg(new MLMsgToGetDownload()))
        //);
        this.subscriptions.add(this.downloadingService.downloadingList.observable.subscribe((list) => {
            this.dataSource.data = list
            this.dataSource.sort = this.sort
        }))
    }

    ngAfterViewInit() {
        this.sort.sort({ id: "name" } as MatSortable)
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe(null)
    }
}
