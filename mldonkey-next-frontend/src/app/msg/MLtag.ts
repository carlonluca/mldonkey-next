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
 * Date: 2023.11.13
 */
export enum MLTagType {
    T_UINT32,
    T_SINT32,
    T_STRING,
    T_IP,
    T_SINT16,
    T_SINT8,
    T_SINT32_PAIR
}

export class MLTag {
    constructor(
        public name: string,
        public type: MLTagType
    ) {}
}

export class MLTagUint32 extends MLTag {
    constructor(name: string, public value: number) {
        super(name, MLTagType.T_UINT32)
    }
}

export class MLTagInt32 extends MLTag {
    constructor(name: string, public value: number) {
        super(name, MLTagType.T_SINT32)
    }
}

export class MLTagString extends MLTag {
    constructor(name: string, public value: string) {
        super(name, MLTagType.T_STRING)
    }
}

export class MLTagIp extends MLTag {
    constructor(name: string, public value: number) {
        super(name, MLTagType.T_IP)
    }
}

export class MLTagIn16 extends MLTag {
    constructor(name: string, public value: number) {
        super(name, MLTagType.T_SINT16)
    }
}

export class MLTagIn8 extends MLTag {
    constructor(name: string, public value: number) {
        super(name, MLTagType.T_SINT8)
    }
}

export class MLTagInt32Pair extends MLTag {
    constructor(name: string, public value1: number, public value2: number) {
        super(name, MLTagType.T_SINT32_PAIR)
    }
}
