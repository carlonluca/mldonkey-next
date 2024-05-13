import { Component, Input, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MLMsgFromAddSectionOption } from 'src/app/msg/MLMsgOptions'
import { UiServiceService } from 'src/app/services/ui-service.service'
import "../../../../core/extensions"

class OptionItem extends MLMsgFromAddSectionOption {
    public proposedValue: string | undefined = undefined

    constructor(option: MLMsgFromAddSectionOption) {
        super(
            option.section,
            option.description,
            option.name,
            option.optionType,
            option.help,
            option.currentValue,
            option.defaultValue,
            option.advanced
        )
        console.log("Option type:", option.name, option.optionType)
    }
}

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
        this.dataSource = new MatTableDataSource<MLMsgFromAddSectionOption>(this.options.map(o => new OptionItem(o)))
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

    computeHelp(option: MLMsgFromAddSectionOption): string {
        if (!option.help)
            return "-"
        if (!option.help.endsWith("."))
            return option.help.charAt(0).toUpperCase() + option.help.slice(1) + "."
        else
            return option.help.charAt(0).toUpperCase() + option.help.slice(1)
    }

    isString(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("string")
    }

    isInteger(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("int") || option.optionType.caseInsensitiveCompare("integer")
    }

    isIp(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("ip")
    }

    isBool(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("bool")
    }

    isFloat(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("float")
    }
}
