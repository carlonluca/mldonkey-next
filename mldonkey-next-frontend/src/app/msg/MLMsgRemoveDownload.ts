/*
 * This file is part of mldonket-next.
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

import { MLMessageTypeTo, MLMsgTo } from "./MLMsg";

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2024.04.09
 */

export class MLMsgToRemoveDownload extends MLMsgTo {
    constructor(public fileId: number) { super(MLMessageTypeTo.T_REMOVE_DOWNLOAD_QUERY) }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendInt32(ret, this.fileId)
        return this.createEnvelope(ret)
    }
}
