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

import { Component, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { faDoorOpen, faHardDrive, faHelmetSafety, faPersonRunning } from '@fortawesome/free-solid-svg-icons'
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet'
import { MLMsgFromSysInfo } from 'src/app/msg/MLMsgSysInfo'
import { SysinfoService } from 'src/app/services/sysinfo.service'
import { DateTime } from 'luxon'
import { MLUtils } from 'src/app/core/MLUtils'
import prettyBytes from 'pretty-bytes'

class RowData {
    key: string
    label: string
    value: string
}

class PortData {
    network: string
    port: number
    type: string
}

class ShareData {
    dir: string
    strategy: string
    used: number
    free: number
    percFree: number
    filesystem: string
}

class Key {
    key: string
    label: string
}

class FormattableKey {
    key: string
    label: string
    format: (s: string) => string
}

@Component({
    selector: 'app-sysinfo',
    templateUrl: './sysinfo.component.html',
    styleUrls: ['./sysinfo.component.scss']
})
export class SysInfoComponent implements OnInit {
    dataSourceBuildInfo = new MatTableDataSource<RowData>([])
    dataSourceRunInfo = new MatTableDataSource<RowData>([])
    dataSourcePortInfo = new MatTableDataSource<PortData>([])
    dataSourceShareInfo = new MatTableDataSource<ShareData>([])
    subscriptions = new MLSubscriptionSet()
    faHelmetSafety = faHelmetSafety
    faPersonRunning = faPersonRunning
    faDoorOpen = faDoorOpen
    faHardDrive = faHardDrive

    constructor(public sysinfoService: SysinfoService) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.sysinfoService.sysInfo.observable.subscribe(sysInfo => {
                if (sysInfo) {
                    this.refreshBuildInfo(sysInfo)
                    this.refreshRunInfo(sysInfo)
                    this.refreshPortInfo(sysInfo)
                    this.refreshShareInfo(sysInfo)
                }
            })
        )
    }

    private refreshShareInfo(sysInfos: MLMsgFromSysInfo) {
        const info = sysInfos.info
        const keyRegex = /dir_(.+)/
        const valueRegex = /(.+)\|(\d+)\|(\d+)\|(\d+)\|(.+)/
        for (const infoData of info.keys()) {
            if (!infoData.startsWith("dir_"))
                continue
            
            const match1 = infoData.match(keyRegex)
            const dirString = match1 ? match1[1] : null
            if (!dirString)
                continue

            const value = info.get(infoData)
            if (!value)
                continue
            const match2 = value.match(valueRegex)
            if (!match2)
                continue
            
            const strategy = match2[1]
            const diskused = match2[2]
            const diskfree = match2[3]
            const percfree = match2[4]
            const filesystem = match2[5]

            const idx = this.dataSourceShareInfo.data.findIndex(el => el.dir === dirString)
            if (idx < 0) {
                this.dataSourceShareInfo.data.push({
                    dir: dirString,
                    strategy: strategy,
                    used: parseInt(diskused),
                    free: parseInt(diskfree),
                    percFree: parseInt(percfree),
                    filesystem: filesystem
                })
                this.dataSourceShareInfo = new MatTableDataSource(this.dataSourceShareInfo.data)
            }
            else {
                this.dataSourceShareInfo.data[idx].strategy = strategy
                this.dataSourceShareInfo.data[idx].used = parseInt(diskused)
                this.dataSourceShareInfo.data[idx].free = parseInt(diskfree)
                this.dataSourceShareInfo.data[idx].percFree = parseInt(percfree)
                this.dataSourceShareInfo.data[idx].filesystem = filesystem
            }
        }
    }

    private refreshBuildInfo(sysInfos: MLMsgFromSysInfo) {
        const properties = [
            { key: "buildinfo_version_core", label: "Core version" },
            { key: "buildinfo_version_scm", label: "SCM version" },
            { key: "buildinfo_version_ocaml", label: "ocaml compiler version" },
            { key: "buildinfo_version_cc", label: "C compiler version" },
            { key: "buildinfo_version_cxx", label: "C++ compiler version" },
            { key: "buildinfo_configure_args", label: "Configure args" },
            { key: "buildinfo_patches", label: "Patches" },
            { key: "buildinfo_version_build_machine_glibc", label: "glibc build version" },
            { key: "buildinfo_version_runtime_glibc", label: "glibc runtime version" },
            { key: "buildinfo_version_zlib", label: "zlib version" },
            { key: "buildinfo_version_bzip2", label: "bzip2 version" },
            { key: "buildinfo_threads", label: "Has pthread" },
            { key: "buildinfo_gd", label: "Has GD graphics library" },
            { key: "buildinfo_gd_jpg", label: "Has JPEG support in GD" },
            { key: "buildinfo_gd_png", label: "Has PNG support in GD" } ,
            { key: "buildinfo_iconv", label: "Has iconv" },
            { key: "buildinfo_iconv_conversion", label: "Has iconv conversion" },
            { key: "buildinfo_magic", label: "Has libmagic" },
            { key: "buildinfo_upnp_natpmp", label: "Has upnp natpmp" },
            { key: "buildinfo_check_bounds", label: "Has array/string access bounds-checking" },
            { key: "buildinfo_net_donkey", label: "Has network donkey" },
            { key: "buildinfo_net_bt", label: "Has network BitTorrent" },
            { key: "buildinfo_net_dc", label: "Has network DirectConnect" },
            { key: "buildinfo_net_ft", label: "Has network FastTrack" },
            { key: "buildinfo_net_gt", label: "Has network Gnutella" },
            { key: "buildinfo_net_gt2", label: "Has network Gnutell2" },
            { key: "buildinfo_net_filetp", label: "Has network FileTP" }
        ]
        this.addHostIfNeeded(sysInfos, this.dataSourceBuildInfo.data)
        for (let i = 0; i < properties.length; i++)
            this.addValueIfNeeded(properties[i], sysInfos, this.dataSourceBuildInfo.data)
    }

    private refreshRunInfo(sysInfo: MLMsgFromSysInfo) {
        const info = sysInfo.info
        const properties: FormattableKey[] = [{
            key: "runinfo_host_machine",
            label: "Host machine",
            format: s => s
        }, {
            key: "runinfo_host_machine_supported",
            label: "Host machine supported",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_user",
            label: "Logged in user",
            format: (s: string) => s
        }, {
            key: "runinfo_user_emptypwd",
            label: "Password protected account",
            format: (s: string) => this.displayBoolean(s, true)
        }, {
            key: "runinfo_core_start_time",
            label: "Startup time",
            format: (s: string) => this.displayUnixTimestamp(s)
        }, {
            key: "runinfo_core_uptime",
            label: "Uptime",
            format: (s: string) => {
                const uptimeSecs = parseInt(s)
                return MLUtils.prettyFormat(uptimeSecs*1000)
            }
        }, {
            key: "runinfo_core_user",
            label: "Running as",
            format: (s: string) => {
                const group = info.get("runinfo_core_group")
                const parts = []
                if (s)
                    parts.push(s)
                else
                    parts.push("<unknown user>")
                if (group)
                    parts.push(group)
                else
                    parts.push("<unknown group>")
                return parts.join(":")
            }
        }, {
            key: "runinfo_net_donkey",
            label: "Donkey network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_overnet",
            label: "Overnet network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_kademlia",
            label: "Kademlia network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_bt",
            label: "BitTorrent network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_dc",
            label: "DirectConnect network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_ft",
            label: "FastTrack network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_gt",
            label: "Gnutella network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_gt2",
            label: "Gnutella2 network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_net_filetp",
            label: "FileTP network enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_server_usage",
            label: "Server usage",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_geoip",
            label: "Geoip enabled",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_bloc_local",
            label: "IP blocking",
            format: s => {
                const parts = []
                if (s)
                    parts.push(`local: ${s} ranges`)
                if (info.get("runinfo_bloc_web"))
                    parts.push(`web: ${info.get("runinfo_bloc_web")} ranges`)
                return parts.join(" - ")
            }
        }, {
            key: "runinfo_dns",
            label: "DNS is working",
            format: s => this.displayBoolean(s, false)
        }, {
            key: "runinfo_lang",
            label: "Language",
            format: s => s
        }, {
            key: "runinfo_locale",
            label: "Locale",
            format: s => s
        }, {
            key: "runinfo_tz",
            label: "Server time zone",
            format: s => s
        }, {
            key: "runinfo_max_string",
            label: "Max string length",
            format: s => s
        }, {
            key: "runinfo_word_size",
            label: "Size of word",
            format: s => s
        }, {
            key: "runinfo_max_arr_size",
            label: "Max array size",
            format: s => s
        }, {
            key: "runinfo_max_int_size",
            label: "Max integer size",
            format: s => s
        }, {
            key: "runinfo_max_fds",
            label: "Max open file descriptors",
            format: s => s
        }, {
            key: "runinfo_max_file_size",
            label: "Max file size",
            format: s => prettyBytes(parseInt(s))
        }]
        for (const property of properties)
            this.addKeyValuePair(property.key, property.label, sysInfo, this.dataSourceRunInfo.data, property.format)
    }

    private refreshPortInfo(sysInfo: MLMsgFromSysInfo) {
        const info = sysInfo.info
        const keyRegex = /port_(\d+)/
        const valueRegex = /(.+)\|(.+)/
        for (const infoData of info.keys()) {
            if (!infoData.startsWith("port_"))
                continue
            
            const match1 = infoData.match(keyRegex)
            const portString = match1 ? match1[1] : null
            if (!portString)
                continue
            const port = parseInt(portString)

            const value = info.get(infoData)
            if (!value)
                continue
            const match2 = value.match(valueRegex)
            if (!match2)
                continue
            
            const net = match2[1]
            const type = match2[2]

            const idx = this.dataSourcePortInfo.data.findIndex(el => el.port === port)
            if (idx < 0) {
                this.dataSourcePortInfo.data.push({
                    port: port,
                    type: type,
                    network: net
                })
                this.dataSourcePortInfo = new MatTableDataSource(this.dataSourcePortInfo.data)
            }
            else {
                this.dataSourcePortInfo.data[idx].network = net
                this.dataSourcePortInfo.data[idx].type = type
            }
        }
    }

    private addValueIfNeeded(key: Key, infos: MLMsgFromSysInfo, list: RowData[]) {
        let value = infos.info.get(key.key)?.trim() ?? "?"
        const lvalue = value.toLocaleLowerCase()
        if (value.length <= 0)
            value = "None"
        if (lvalue == "true" || lvalue == "false")
            value = this.displayBoolean(lvalue, false)
        const idx = list.findIndex(el => el.key === key.key)
        if (idx < 0) {
            list.push({ key: key.key, label: key.label, value: value })
            this.dataSourceBuildInfo = new MatTableDataSource(list)
        }
        else if (list[idx].value !== value)
            list[idx].value = value
    }

    private addKeyValuePair(key: string, label: string, infos: MLMsgFromSysInfo, list: RowData[], format: (s: string) => string) {
        let value = infos.info.get(key)
        if (!value)
            return
        value = format(value)
        const idx = list.findIndex(el => el.key === key)
        if (idx < 0) {
            list.push({
                key: key,
                label: label,
                value: value
            })
            this.dataSourceRunInfo = new MatTableDataSource(list)
        }
        else if (list[idx].value !== value)
            list[idx].value = value
    }

    private addHostIfNeeded(infos: MLMsgFromSysInfo, list: RowData[]) {
        const value = `${infos.info.get("buildinfo_version_build_machine")} (${infos.info.get("buildinfo_machine_endianness")})`
        if (list.length <= 0)
            list.push({ key: "buildinfo_version_build_machine", label: "Built on", value: value })
        else if (list[0].key !== "buildinfo_version_build_machine")
            list.splice(0, 0, { key: "buildinfo_version_build_machine", label: "Built on", value: value })
        else if (list[0].value !== value)
            list[0].value = value
    }

    private displayBoolean(s: string, inv: boolean) {
        return (s.toLocaleLowerCase() == "true") ? (inv ? "✗" : "✓") : (inv ? "✓" : "✗")
    }

    private displayUnixTimestamp(s: string | undefined): string {
        if (!s)
            return ""
        const timestamp = parseInt(s)
        const date = DateTime.fromSeconds(timestamp)
        return date.toLocaleString(DateTime.DATETIME_FULL)
    }
}
