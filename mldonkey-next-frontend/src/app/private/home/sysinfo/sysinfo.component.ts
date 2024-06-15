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

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { faHelmetSafety } from '@fortawesome/free-solid-svg-icons';
import { MLSubscriptionSet } from 'src/app/core/MLSubscriptionSet';
import { MLMsgFromSysInfo } from 'src/app/msg/MLMsgSysInfo';
import { SysinfoService } from 'src/app/services/sysinfo.service';

class RowData {
    key: string
    label: string
    value: string
}

class Key {
    key: string
    label: string
}

@Component({
    selector: 'app-sysinfo',
    templateUrl: './sysinfo.component.html',
    styleUrls: ['./sysinfo.component.scss']
})
export class SysInfoComponent implements OnInit {
    dataSourceBuildInfo = new MatTableDataSource<RowData>([])
    subscriptions = new MLSubscriptionSet()
    faHelmetSafety = faHelmetSafety

    constructor(public sysinfoService: SysinfoService) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.sysinfoService.sysInfo.observable.subscribe(sysInfo => {
                if (sysInfo)
                    this.refreshBuildInfo(sysInfo)
            })
        )
    }

    private refreshBuildInfo(sysInfos: MLMsgFromSysInfo) {
        const properties: Key[] = [
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

    private addValueIfNeeded(key: Key, infos: MLMsgFromSysInfo, list: RowData[]) {
        let value = infos.info.get(key.key)?.trim() ?? "?"
        if (value.length <= 0)
            value = "None"
        if (value.toLocaleLowerCase() == "true")
            value = "✓"
        if (value.toLocaleLowerCase() == "false")
            value = "✗"
        const idx = list.findIndex(el => el.key === key.key)
        if (idx < 0)
            list.push({ key: key.key, label: key.label, value: value })
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
}
