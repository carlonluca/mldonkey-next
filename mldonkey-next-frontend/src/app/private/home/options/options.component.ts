import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core'
import { OptionsService } from 'src/app/services/options.service'
import { OptionSectionComponent } from './option-section/option-section.component'

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements AfterViewInit {
    @ViewChildren('optionSection') optionSections: QueryList<OptionSectionComponent>
    confChanged = false

    constructor(public optionService: OptionsService, private elementRef: ElementRef<HTMLElement>) {}

    ngAfterViewInit() {
        this.refreshChangedConf()
    }

    refreshChangedConf() {
        for (const section of this.optionSections.toArray()) {
            if (!section)
                continue
            if (section.confChangedValue) {
                this.confChanged = true
                return
            }
        }

        this.confChanged = false
    }

    submitChanges() {
        for (let section of this.optionSections.toArray())
            section.submitChanges()
    }

    dropChanges() {
        for (let section of this.optionSections.toArray())
            section.dropChanges()
    }
}
