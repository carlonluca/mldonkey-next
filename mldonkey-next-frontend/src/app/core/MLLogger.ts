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

import log from 'loglevel'

const _wsLogger = log.getLogger("websocket")
const _searchLogger = log.getLogger("search")
const _uiLogger = log.getLogger("ui")

_wsLogger.setLevel(log.levels.WARN)
_uiLogger.setLevel(log.levels.DEBUG)
_searchLogger.setLevel(log.levels.DEBUG)

export const wsLogger = _wsLogger
export const uiLogger = _uiLogger
export const searchLogger = _searchLogger
