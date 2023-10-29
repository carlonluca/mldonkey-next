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

import { MLMessageFrom, MLMessageTypeFrom } from "./MLMsg";
import { MLMsgDownloadElement } from "./MLMsgDownload";

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2023.10.28
 */
export class MLMsgFromFileInfo extends MLMessageFrom {
    /**
     * Ctor.
     * 
     * @param downloadElement 
     */
    constructor(public downloadElement: MLMsgDownloadElement) {
        super(MLMessageTypeFrom.T_FILE_INFO)
    }

    /**
     * Parses the buffer.
     * 
     * @param buffer 
     * @returns 
     */
    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromFileInfo {
        return new MLMsgFromFileInfo(MLMsgDownloadElement.fromBuffer(buffer))
    }
}
