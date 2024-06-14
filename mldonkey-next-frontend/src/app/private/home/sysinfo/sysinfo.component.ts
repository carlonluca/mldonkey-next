import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
            { key: "buildinfo_version_ocaml", label: "ocaml version" }
        ]
        for (let i = 0; i < properties.length; i++)
            this.addValueIfNeeded(properties[i], sysInfos, this.dataSourceBuildInfo.data)
    }

    private addValueIfNeeded(key: Key, infos: MLMsgFromSysInfo, list: RowData[]) {
        const value = infos.info.get(key.key) ?? "?"
        const idx = list.findIndex(el => el.key === key.key)
        if (idx < 0)
            list.push({ key: key.key, label: key.label, value: value })
        else if (list[idx].value !== value)
            list[idx].value = value
    }
}
