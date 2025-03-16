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
 * Date:    2025.02.25
 */

import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatMenuTrigger } from '@angular/material/menu'
import { MatSort, MatSortable, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { MLSortMode } from 'src/app/core/MLSortMode'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLMsgFromSharedFileInfo } from 'src/app/msg/MLMsgSharedFileInfo'
import { SharedFilesinfoService } from 'src/app/services/sharedfilesinfo.service'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { buildUrl } from 'build-url-ts'
import { StorageService } from 'src/app/services/storage.service'
import { MLUtils } from 'src/app/core/MLUtils'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
    selector: 'app-sharedfiles',
    templateUrl: './sharedfiles.component.html',
    styleUrl: './sharedfiles.component.scss',
    standalone: false
})
export class SharedFilesComponent implements AfterViewInit, OnInit, OnDestroy {
    dataSource = new MatTableDataSource<MLMsgFromSharedFileInfo>([])
    displayedColumns: string[] = this.displayColumns()
    totalUploaded = BigInt(0)
    totalSize = BigInt(0)
    totalRequets = 0
    sortModes = [
        new MLSortMode("name", true, "Name (a → z)", true),
        new MLSortMode("name", false, "Name (z → a)"),
        new MLSortMode("size", true, "Size ↑"),
        new MLSortMode("size", false, "Size ↓"),
        new MLSortMode("uploaded", true, "Uploaded ↑"),
        new MLSortMode("uploaded", false, "Uploaded ↓"),
        new MLSortMode("reqcount", true, "Request count ↑"),
        new MLSortMode("reqcount", true, "Request count ↓")
    ]

    @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger
    contextMenuPosition = { x: '0px', y: '0px' };

    @ViewChild(MatSort) sort: MatSort

    private subscriptions = new MLSubscriptionSet()

    constructor(
        public sharedFilesInfo: SharedFilesinfoService,
        public uiSerivce: UiServiceService,
        public storageService: StorageService,
        public router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.subscriptions.add(
            this.sharedFilesInfo.elements.observable.subscribe((sharedFiles) => {
                this.refreshDataSource(sharedFiles)
            })
        )
        this.subscriptions.add(this.uiSerivce.mobileLayout.observable.subscribe(() =>
            this.refreshColumns()
        ))
        this.refreshDataSource(this.sharedFilesInfo.elements.value)
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.sort.sort({ id: "name" } as MatSortable)
        }, 0)
        this.dataSource.sort = this.sort
        this.dataSource.sortingDataAccessor = (item, prop) => {
            switch (prop) {
                case "size":
                    return Number(item.fileSize / 1024n)
                case "name":
                    return item.fileName
                case "uploaded":
                    return Number(item.uploadedBytes / 1024n)
                case "reqcount":
                    return Number(item.requestCount)
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
            if (!sortState)
                return

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

    async downloadFileBlob(url: string, fileName: string) {
        const response = await fetch(url)
        const blob = await response.blob()
        const blobUrl = URL.createObjectURL( blob);
        const aElement = document.createElement('a');
        aElement.href = blobUrl;
        aElement.download = fileName;
        aElement.style.display = 'none';
        document.body.appendChild(aElement);
        aElement.click();
        URL.revokeObjectURL(blobUrl);
        aElement.remove();   
    }

    onContextMenuAction(item: MLMsgFromSharedFileInfo) {
        const credentials = this.storageService.getLoginData()
        if (MLUtils.isWebView())
            MLUtils.signalToNative(this.router, this.route, {
                action: "download",
                id: item.sharedFileId,
                uname: credentials?.username,
                passwd: credentials?.passwd
            })
        else
            this.downloadFileBlob(buildUrl(window.location.origin, {
                path: "download",
                queryParams: {
                    id: item.sharedFileId,
                    uname: credentials?.username,
                    passwd: credentials?.passwd
                }
            }), item.fileName)
    }

    onContextMenu(event: MouseEvent, _item: MLMsgFromSharedFileInfo) {
        event.preventDefault()
        this.menuTrigger.openMenu()
    }

    private refreshColumns() {
        this.displayedColumns = this.displayColumns()
    }

    private displayColumns(): string[] {
        if (this.uiSerivce.mobileLayout.value)
            return ['name', "options"]
        else
            return ['name', 'size', 'uploaded', 'reqcount', "options"]
    }

    private refreshDataSource(sharedFilesMap: Map<number, MLMsgFromSharedFileInfo>) {
        let totalUploaded = BigInt(0)
        let totalSize = BigInt(0)
        let totalRequests = 0
        sharedFilesMap.forEach(e => {
            totalUploaded += e.uploadedBytes
            totalSize += e.fileSize
            totalRequests += e.requestCount
        })

        this.totalSize = totalSize
        this.totalUploaded = totalUploaded
        this.totalRequets = totalRequests
        this.dataSource.data = Array.from(sharedFilesMap.values())
    }
}
