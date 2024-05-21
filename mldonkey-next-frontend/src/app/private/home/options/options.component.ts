import { AfterViewInit, Component, QueryList, ViewChildren } from '@angular/core'
import { OptionsService } from 'src/app/services/options.service'
import { OptionSectionComponent } from './option-section/option-section.component'
import { MLStringPair } from 'src/app/core/MLUtils'
import { WebSocketService } from 'src/app/websocket-service.service'
import { MLMsgToSaveOptions } from 'src/app/msg/MLMsgOptions'

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements AfterViewInit {
    @ViewChildren('optionSection') optionSections: QueryList<OptionSectionComponent>
    confChanged = false

    constructor(public optionService: OptionsService, private websocketService: WebSocketService) {}

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
        const changed: MLStringPair[] = []
        for (const section of this.optionSections.toArray())
            for (const optionItem of section.dataSource.data)
                if (optionItem.isChanged())
                    changed.push([ optionItem.name, "" + optionItem.proposedValue ])
        if (changed.length > 0)
            this.websocketService.sendMsg(new MLMsgToSaveOptions(changed))
        for (const section of this.optionSections.toArray())
            section.submitChanges()
    }

    dropChanges() {
        for (const section of this.optionSections.toArray())
            section.dropChanges()
    }
}
