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

import { Injectable, OnDestroy } from '@angular/core'
import { WebSocketService } from '../websocket-service.service'
import { MLOptionManager, MLOptionSection } from '../core/MLOptionManager'
import { MLSubscriptionSet } from '../core/MLSubscriptionSet'
import { MLMsgFromAddSectionOption } from '../msg/MLMsgOptions'

@Injectable({
    providedIn: 'root'
})
export class OptionsService implements OnDestroy {
    public optionManager
    public subscriptions = new MLSubscriptionSet()
    public sections: MLOptionSection[] = []

    constructor(public websocketService: WebSocketService) {
        this.optionManager = new MLOptionManager(websocketService)
        this.subscriptions.add(this.optionManager.elements.observable.subscribe(options => this.refreshSections(options)))
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe(null)
    }

    private refreshSections(options: Map<string, MLMsgFromAddSectionOption>) {
        options.forEach((option, id) => {
            const sectionName = id.split("/")[0]
            const optionName = id.split("/")[1]
            let sectionItem: MLOptionSection | null = null
            for (const section of this.sections) {
                if (section.name === sectionName) {
                    sectionItem = section
                    break
                }
            }
            if (!sectionItem) {
                sectionItem = new MLOptionSection()
                sectionItem.name = sectionName
                sectionItem.options = []
                this.sections.push(sectionItem)
            }

            for (const _option of sectionItem.options)
                if (_option.name === optionName)
                    return
            
            sectionItem.options.push(option)
        })
    }
}
