/*
 * This file is part of mldonkey-next.
 *
 * Copyright (c) 2025 Luca Carlon
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
 * Date:    2025.10.07
 */

import { MLHostname } from "./MLHostname"
import { MLIp2 } from "./MLIp2"

export enum ClientConnType {
    C_T_DIRECT,
    C_T_FIREWALLED
}

export class MLClientKind {
    constructor(
        public clientType: ClientConnType,
        public clientHostname: MLHostname | null,
        public clientHash: ArrayBuffer | null,
        public clientIp: MLIp2 | null,
        public port: number
    ) {}
}
