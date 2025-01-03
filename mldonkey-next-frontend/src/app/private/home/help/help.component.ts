import { Component } from '@angular/core';
import { ConsoleService } from 'src/app/services/console.service';

@Component({
    selector: 'app-help',
    imports: [],
    templateUrl: './help.component.html',
    styleUrl: './help.component.scss'
})
export class HelpComponent {
    constructor(public consoleService: ConsoleService) {}
}
