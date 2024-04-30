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

import { Injectable } from '@angular/core';
import { MLObservableVariable } from '../core/MLObservableVariable';

@Injectable({
    providedIn: 'root'
})
export class UiServiceService {
    mobileLayout = new MLObservableVariable(UiServiceService.isMobile())

    constructor() {
        window.onresize = () => {
            this.mobileLayout.value = UiServiceService.isMobile()
        }
    }

    public static isMobile(): boolean {
        return window.innerWidth <= 991
    }
}
