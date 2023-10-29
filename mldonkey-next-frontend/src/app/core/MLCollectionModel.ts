/*
 * This file is part of mldonket-next.
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
 * Date: 2023.08.14
 */

import { MLObservableVariable } from "./MLObservableVariable"
import { MLUPdateable } from "./MLUpdateable"

export abstract class MLCollectionModel<K, V extends MLUPdateable<V>> {
    public elements: MLObservableVariable<Map<K, V>> = new MLObservableVariable(new Map())

    public getWithKey(key: K): V | undefined {
        return this.elements.value.get(key)
    }

    protected abstract keyFromValue(value: V): K

    protected handleValue(value: V) {
        const oldValue = this.elements.value.get(this.keyFromValue(value))
        if (!oldValue)
            this.elements.value.set(this.keyFromValue(value), value)
        else
            oldValue.update(value)
        this.elements.observable.next(this.elements.value)
    }

    protected removeWithKey(value: K) {
        this.elements.value.delete(value)
    }
}
