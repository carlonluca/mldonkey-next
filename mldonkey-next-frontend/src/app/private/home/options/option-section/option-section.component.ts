import { Component, Input, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MLMsgFromAddSectionOption } from 'src/app/msg/MLMsgOptions'
import { UiServiceService } from 'src/app/services/ui-service.service'

@Component({
    selector: 'app-option-section',
    templateUrl: './option-section.component.html',
    styleUrls: ['./option-section.component.scss']
})
export class OptionSectionComponent implements OnInit {
    @Input() options: MLMsgFromAddSectionOption[]

    dataSource = new MatTableDataSource<MLMsgFromAddSectionOption>([])

    constructor(public uiService: UiServiceService) {}

    ngOnInit(): void {
        this.dataSource = new MatTableDataSource<MLMsgFromAddSectionOption>(this.options)
    }

    computeDescription(option: MLMsgFromAddSectionOption): string {
        if (!option.description && !option.name)
            return "-"
        if (!option.description)
            return option.name
        // In some cases this happens. Let's show it without capitalizing it.
        if (option.description === option.name)
            return option.name
        // Sometimes the string is not well formatted.
        return option.description.charAt(0).toUpperCase() + option.description.slice(1)
    }
}
