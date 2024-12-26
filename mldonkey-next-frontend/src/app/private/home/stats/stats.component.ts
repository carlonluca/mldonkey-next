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
import { LegendComponentOption, type EChartsOption } from 'echarts'
import { MLUtils } from 'src/app/core/MLUtils'
import { MLMsgFromBwUpDownBase } from 'src/app/msg/MLMsgStats'

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    standalone: false
})
export class StatsComponent {
    private computedStyle = getComputedStyle(document.documentElement)

    faPlug = faPlug
    faUnplugged = faPlugCircleXmark
    networkSummaryDataSource = new MatTableDataSource<MLNetworkSummaryModel>([])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usageByNetworkChartMergeOption: any
    usageByNetworkChart: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            valueFormatter: value => MLUtils.beautifySize(BigInt((value as number) * 1024 * 1024))
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
                formatter: value => MLUtils.beautifySize(BigInt((value as number) * 1024 * 1024))
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
                itemStyle: {
                    color: this.computedStyle.getPropertyValue("--bar-chart-color1")
                },
                data: []
            },
            {
                name: 'Downloaded',
                type: 'bar',
                itemStyle: {
                    color: this.computedStyle.getPropertyValue("--bar-chart-color2")
                },
                data: []
            }
        ]
    }

    fontColor = this.computedStyle.getPropertyValue("--chart-font-color")
    bandwidthChartLegend: LegendComponentOption = {
        type: "plain",
        data: ["Uploaded", "Downloaded"],
        orient: 'horizontal',
        top: "auto",
        show: true,
        icon: "circle",
        textStyle: {
            color: this.fontColor
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bandwidthChartMergeOption: any
    bandwidthChartData = []
    bandwidthChart: EChartsOption = {
        darkMode: true,
        legend: this.bandwidthChartLegend,
        tooltip: {
            trigger: 'axis',
            valueFormatter: value => MLUtils.beautifySize(value as number)
        },
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                rotate: 45,
                formatter: v => this.timeFormatter(v),
                color: this.fontColor
            },
            axisPointer: {
                label: {
                    formatter: params => this.timeFormatter(params.value as number)
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                show: true,
                formatter: value => MLUtils.beautifySize(value),
                color: this.fontColor
            }
        },
        series: [
            {
                name: 'Uploaded',
                type: 'line',
                showSymbol: false,
                data: [],
                itemStyle: {
                    color: this.computedStyle.getPropertyValue("--bar-chart-color1")
                }
            },
            {
                name: 'Downloaded',
                type: 'line',
                showSymbol: false,
                data: [],
                itemStyle: {
                    color: this.computedStyle.getPropertyValue("--bar-chart-color2")
                }
            }
        ]
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bandwidthHChartMergeOption: any
    bandwidthHChartData = []
    bandwidthHChart: EChartsOption = {
        tooltip: {
            trigger: 'axis',
            valueFormatter: value => MLUtils.beautifySize(value as number)
        },
        legend: this.bandwidthChartLegend,
        xAxis: {
            type: 'value',
            splitLine: {
                show: false
            },
            axisLabel: {
                rotate: 45,
                formatter: v => this.dateTimeFormatter(v),
                color: this.fontColor
            },
            axisPointer: {
                label: {
                    formatter: params => this.dateTimeFormatter(params.value as number)
                }
            }
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            axisLabel: {
                show: true,
                formatter: value => MLUtils.beautifySize(value),
                color: this.fontColor
            },
            axisPointer: {
                label: {
                    formatter: params => MLUtils.beautifySize(params.value as number)
                }
            }
        },
        series: [
            {
                name: 'Uploaded',
                type: 'line',
                showSymbol: false,
                data: [],
                itemStyle: {
                    color: this.computedStyle.getPropertyValue("--bar-chart-color1")
                }
            },
            {
                name: 'Downloaded',
                type: 'line',
                showSymbol: false,
                data: [],
                itemStyle: {
                    color: this.computedStyle.getPropertyValue("--bar-chart-color2")
                }
            }
        ]
    }

    constructor(public statsService: StatsService, private websocketService: WebSocketService) {
        this.statsService.byNetworkStats.observable.subscribe((stats) => {
            this.networkSummaryDataSource.data = stats
            this.refreshByNetworkChart(stats)
        })
        this.statsService.bwStats.observable.subscribe((bw) => {
            this.bandwidthChartMergeOption = this.mergeOptionsFromData(bw)
        })
        this.statsService.bwHStats.observable.subscribe((bwh) => {
            this.bandwidthHChartMergeOption = this.mergeOptionsFromData(bwh)
        })
        this.networkSummaryDataSource.data = this.statsService.byNetworkStats.value
        this.refreshByNetworkChart(this.statsService.byNetworkStats.value)
        this.bandwidthChartMergeOption = this.mergeOptionsFromData(this.statsService.bwStats.value)
        this.bandwidthHChartMergeOption = this.mergeOptionsFromData(this.statsService.bwHStats.value)
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mergeOptionsFromData(bw: MLMsgFromBwUpDownBase | null): any {
        const bwUploadSamples = !bw ? [] : this.optionsFromMsg(bw, bw.uploadSamples)
        const bwDownloadSamples = !bw ? [] : this.optionsFromMsg(bw, bw.downloadSamples)

        return {
            series: [{
                data: bwUploadSamples
            }, {
                data: bwDownloadSamples
            }],
            xAxis: {
                max: !bw ? 0 : bw.timeFlag + bw.stepSecs,
                min: !bw ? 0 : bw.timeFlag - bw.stepSecs * Math.max(bwUploadSamples.length, bwDownloadSamples.length)
            }
        }
    }

    private optionsFromMsg(msg: MLMsgFromBwUpDownBase, samples: number[]) {
        const data = []
        const baseTimestamp = msg.timeFlag
        for (let i = samples.length - 1; i >= 0; i--) {
            const number = samples[i]
            data.push([
                baseTimestamp - ((samples.length - 1) - i) * msg.stepSecs,
                number
            ])
        }
        return data
    }

    private timeFormatter(value: number) {
        const date = new Date(value * 1000)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        const seconds = date.getSeconds().toString().padStart(2, '0')
        return `${hours}:${minutes}:${seconds}`
    }

    private dateTimeFormatter(value: number) {
        const date = new Date(value * 1000)
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${day}/${month} ${hours}:${minutes}`
    }
}
