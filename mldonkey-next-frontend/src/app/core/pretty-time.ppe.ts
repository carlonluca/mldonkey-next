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

import { Pipe, PipeTransform } from "@angular/core";
import { MLUtils } from "./MLUtils";

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 2024.11.16
 */

@Pipe({
    standalone: true,
    name: 'prettySecs'
})
export class PrettySecsPipe implements PipeTransform {
    transform(value: number | null | undefined) {
        if (value === null || value === undefined)
            return "-"
        return MLUtils.prettyFormat(value*1000)
    }
}

@Pipe({
    standalone: true,
    name: 'prettySecsShort'
})
export class PrettySecsShortPipe implements PipeTransform {
    transform(value: number | null | undefined) {
        if (value === null || value === undefined)
            return "-"
        if (value < 60)
            return `${Math.floor(value)} secs`
        if (value < 60*60)
            return `${Math.floor(value/60)} mins`
        if (value < 60*60*24)
            return `${Math.floor(value/(60*60))} hours`
        if (value < 60*60*24*30)
            return `${Math.floor(value/(60*60*24))} days`
        if (value < 60*60*24*30*12)
            return `${Math.floor(value/(60*60*24*30))} months`
        return `${Math.floor(value/(60*60*24*30*12))} years`
    }
}
