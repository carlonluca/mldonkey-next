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
import { MLUPdateable } from "../core/MLUpdateable"
import { MLStringPair } from "../core/MLUtils"
import { MLMsgFrom, MLMessageTypeFrom, MLMsgTo, MLMessageTypeTo } from "./MLMsg"
import { MLMsgReader } from "./MLMsgReader"

export class MLMsgFromOptionsInfo extends MLMsgFrom {
    constructor(public options: [string, string][]) {
        super(MLMessageTypeFrom.T_OPTIONS_INFO)
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromOptionsInfo {
        return new MLMsgFromOptionsInfo(new MLMsgReader(buffer).takeStringPairList())
    }
}

export class MLMsgFromAddSectionOption extends MLMsgFrom implements MLUPdateable<MLMsgFromAddSectionOption> {
    constructor(
        public section: string,
        public description: string,
        public name: string,
        public optionType: string,
        public help: string,
        public currentValue: string,
        public defaultValue: string,
        public advanced: number
    ) {
        super(MLMessageTypeFrom.T_ADD_SECTION_OPTION)
    }

    update(update: MLMsgFromAddSectionOption): void {
        this.section = update.section
        this.description = update.description
        this.name = update.name
        this.optionType = update.optionType
        this.help = update.help
        this.currentValue = update.currentValue
        this.defaultValue = update.defaultValue
        this.advanced = update.advanced
    }

    public static fromBuffer(buffer: ArrayBuffer): MLMsgFromAddSectionOption {
        const reader = new MLMsgReader(buffer, 0)
        const section = reader.takeString()
        const description = reader.takeString()
        const name = reader.takeString()
        const optionType = reader.takeString()
        const help = reader.takeString()
        const currentValue = reader.takeString()
        const defaultValue = reader.takeString()
        const advanced = reader.takeInt8()
        return new MLMsgFromAddSectionOption(
            section,
            description,
            name,
            optionType,
            help,
            currentValue,
            defaultValue,
            advanced
        )
    }
}

export class MLMsgToSaveOptions extends MLMsgTo {
    constructor(public options: MLStringPair[]) {
        super(MLMessageTypeTo.T_SAVE_OPTIONS_QUERY)
    }

    public override toBuffer(): ArrayBuffer {
        let ret = new ArrayBuffer(0)
        ret = this.appendStringPair(ret, this.options)
        return this.createEnvelope(ret)
    }
}
