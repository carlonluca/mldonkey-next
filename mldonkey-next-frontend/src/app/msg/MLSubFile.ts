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
 * Date:    2025.01.04
 */

import { MLMsgReader } from "./MLMsgReader"

export class MLSubFile {
    constructor(
        public name: string,
        public size: bigint,
        public format: string
    ) {}

    public static fromReader(reader: MLMsgReader): MLSubFile {
        return new MLSubFile(
            reader.takeString(),
            reader.takeInt64(),
            reader.takeString()
        )
    }
}
