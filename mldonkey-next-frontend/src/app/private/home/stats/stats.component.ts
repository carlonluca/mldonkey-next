/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2024 Luca Carlon
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
 * Date:    2024.11.20
 */
import { Component } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { faPlug, faPlugCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { MLNetworkSummaryModel, StatsService } from 'src/app/services/stats.service'
import { WebSocketService } from 'src/app/websocket-service.service'
import { type EChartsOption } from 'echarts'
import { MLUtils } from 'src/app/core/MLUtils'

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss']
})
export class StatsComponent {
    faPlug = faPlug
    faUnplugged = faPlugCircleXmark
    networkSummaryDataSource = new MatTableDataSource<MLNetworkSummaryModel>([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usageByNetworkChartMergeOption: any;
    usageByNetworkChart: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            valueFormatter: value => MLUtils.beautifySize(BigInt((value as number)*1024*1024))
        },
        legend: {
            textStyle: {
                color: "white"
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
                show: true,
                rotate: 45,
                formatter: value => MLUtils.beautifySize(BigInt((value as number)*1024*1024))
            }
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [
            {
                name: 'Uploaded',
                type: 'bar',
                data: []
            },
            {
                name: 'Downloaded',
                type: 'bar',
                data: []
            }
        ]
    }

    constructor(public statsService: StatsService, private websocketService: WebSocketService) {
        this.statsService.byNetworkStats.observable.subscribe((stats) => {
            this.networkSummaryDataSource.data = stats
            this.refreshByNetworkChart(stats)
        })
        this.networkSummaryDataSource.data = this.statsService.byNetworkStats.value
        this.refreshByNetworkChart(this.statsService.byNetworkStats.value)
    }

    networkInfo(networkNum: number) {
        return this.websocketService.networkManager.getWithKey(networkNum)
    }

    refreshByNetworkChart(summary: MLNetworkSummaryModel[]) {
        const networkNames: string[] = []
        const uploadedData: number[] = []
        const downloadedData: number[] = []
        summary?.forEach(n => {
            networkNames.push(n.networkName)
            uploadedData.push(Number(n.uploadedBytes / BigInt(1024 * 1024)))
            downloadedData.push(Number(n.downloadedBytes / BigInt(1024 * 1024)))
        })
        this.usageByNetworkChartMergeOption = {
            series: [
                {
                    name: "Uploaded",
                    type: "bar",
                    data: uploadedData
                },
                {
                    name: "Downloaded",
                    type: "bar",
                    data: downloadedData
                }
            ],
            yAxis: {
                type: 'category',
                data: networkNames
            }
        }
    }
}
