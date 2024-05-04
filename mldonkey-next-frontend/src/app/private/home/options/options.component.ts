import { Component } from '@angular/core'
import { OptionsService } from 'src/app/services/options.service'

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
    constructor(public optionService: OptionsService) {
    }
}
