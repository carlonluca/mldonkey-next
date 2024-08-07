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

import { BehaviorSubject } from "rxjs";

/**
 * A variable that can be observed.
 */
export class MLObservableVariable<T> {
    public observable: BehaviorSubject<T>
    constructor(private defaultValue: T) {
        this.observable = new BehaviorSubject<T>(this.defaultValue)
    }
    set value(v: T) {
        if (v !== this.value)
            this.observable.next(v)
    }
    get value(): T {
        return this.observable.value
    }
}
