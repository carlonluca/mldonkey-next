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

import { Component, Input, OnInit } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { MLMsgFromAddSectionOption } from 'src/app/msg/MLMsgOptions'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips'
import "../../../../core/extensions"

class OptionItem extends MLMsgFromAddSectionOption {
    public proposedValue: string | undefined = undefined
    
    private static implementedTypes: string[] = [
        "string",
        "int",
        "integer",
        "int64",
        "float",
        "ip",
        "bool",
        "string list",
        "ip list",
        "range list"
    ]

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
        if (!OptionItem.implementedTypes.find((t) => t.caseInsensitiveCompare(option.optionType)))
            console.log(`Option ${option.name} has an unimplemented type ${option.optionType}`)
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

    computeList(option: OptionItem): string[] {
        return this.listToArray(option.currentValue)
    }

    addItem(event: MatChipInputEvent, option: OptionItem) {
        const value = (event.value || '').trim()
        option.currentValue += " " + value
    }

    removeItem(value: string, option: OptionItem) {
        let values = this.listToArray(option.currentValue)
        values = values.filter(item => item != value)
        option.currentValue = this.listFromArray(values)
    }

    editItem(event: MatChipEditedEvent, oldValue: string, option: OptionItem) {
        const values = this.listToArray(option.currentValue)
        const idx = values.indexOf(oldValue)
        if (idx >= 0) {
            values[idx] = event.value
            option.currentValue = this.listFromArray(values)
        }
    }

    isString(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("string")
    }

    isStringList(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("string list")
        || option.optionType.caseInsensitiveCompare("range list")
        || option.optionType.caseInsensitiveCompare("ip list")
    }

    isInteger(option: OptionItem): boolean {
        return option.optionType.caseInsensitiveCompare("int")
        || option.optionType.caseInsensitiveCompare("integer")
        || option.optionType.caseInsensitiveCompare("int64")
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

    listToArray(values: string): string[] {
        return values.split(" ")
    }

    listFromArray(values: string[]): string {
        return values.join(" ")
    }
}