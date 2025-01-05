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
 * Date:    2025.01.03
 */

import { wsLogger } from "../core/MLLogger"
import { MLUPdateable } from "../core/MLUpdateable"

export enum MLAddrType {
    A_T_IP,
    A_T_NAME
}

export class MLAddr implements MLUPdateable<MLAddr> {
    constructor(
        public addrType: MLAddrType,
        public countryCode: number,
        public blocked: number
    ) {}

    update(update: MLAddr): void {
        this.addrType = update.addrType
        this.countryCode = update.countryCode
        this.blocked = update.blocked
    }

    public static addrTypeFromInt(i: number): MLAddrType {
        switch (i) {
            case 0:
                return MLAddrType.A_T_IP
            case 1:
                return MLAddrType.A_T_NAME
            default:
                wsLogger.warn(`Unknown addr type: $i`)
                return MLAddrType.A_T_NAME
        }
    }
}

export class MLAddrIp extends MLAddr implements MLUPdateable<MLAddrIp> {
    constructor(
        geoIp: number,
        blocked: number,
        public addrIp: number
    ) {
        super(MLAddrType.A_T_IP, geoIp, blocked)
    }

    override update(update: MLAddr): void {
        super.update(update)
        this.addrIp = (update as MLAddrIp).addrIp
    }
}

export class MLAddrName extends MLAddr implements MLUPdateable<MLAddrName> {
    constructor(
        geoIp: number,
        blocked: number,
        public nameAddr: string
    ) {
        super(MLAddrType.A_T_NAME, geoIp, blocked)
    }

    override update(update: MLAddrName): void {
        super.update(update)
        this.nameAddr = (update as MLAddrName).nameAddr
    }
}
