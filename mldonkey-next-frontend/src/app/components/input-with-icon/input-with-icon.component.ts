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

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

@Component({
    selector: 'app-input-with-icon',
    templateUrl: './input-with-icon.component.html',
    styleUrls: ['./input-with-icon.component.scss'],
    standalone: false
})
export class InputWithIconComponent {
    @Input()
    public faIcon: IconDefinition
    @Input()
    public matIcon: string
    @Input()
    public label: string
    @Input()
    public tooltip: string
    @Input()
    public userInput: string
    @Input()
    public type: string
    @Input()
    public autocapitalize: string
    @Output()
    public userInputChange = new EventEmitter<string>()
}
