/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2023 Luca Carlon
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

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 14.08.2023
 */

import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { SpinnerService } from '../../services/spinner.service'

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    standalone: false
})
export class SpinnerComponent implements OnInit, OnDestroy {
    showSpinner = false;
    private subscription!: Subscription;

    constructor(private spinnerService: SpinnerService) { }

    ngOnInit() {
        this.subscription = this.spinnerService.spinnerVisible.observable.subscribe(
            state => (this.showSpinner = state)
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    preventEventPropagation(event: Event) {
        event.stopPropagation()
        event.preventDefault()
    }
}
