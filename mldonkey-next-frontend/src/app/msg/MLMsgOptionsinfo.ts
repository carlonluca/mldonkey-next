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

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2024.05.03
 */
import { MLMsgFrom, MLMessageTypeFrom } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgFromOptionsInfo extends MLMsgFrom {
    constructor(public options: [string, string][]) {
        super(MLMessageTypeFrom.T_OPTIONS_INFO)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromOptionsInfo {
        return new MLMsgFromOptionsInfo(new MLMsgReader(buffer).takeStringPairList())
    }
}
