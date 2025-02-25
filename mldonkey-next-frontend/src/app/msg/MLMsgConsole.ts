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

import { MLMsgFrom, MLMessageTypeFrom, MLMsgTo, MLMessageTypeTo } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgFromConsole extends MLMsgFrom {
    constructor(public command: string) {
        super(MLMessageTypeFrom.T_CONSOLE)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromConsole {
        return new MLMsgFromConsole(new MLMsgReader(buffer).takeString())
    }
}

export class MLMsgToConsoleCommand extends MLMsgTo {
    constructor(
        public command: string
    ) {
        super(MLMessageTypeTo.T_COMMAND)
    }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendString(ret, this.command)
        return this.createEnvelope(ret)
    }
}
