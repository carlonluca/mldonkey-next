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
 * Date:    2025.03.04
 * Company: -
 */

export const MLDONKEY_NEXT_WEBAPP_PORT = parseInt(process.env.MLDONKEY_NEXT_WEBAPP_PORT) || 4081
export const MLDONKEY_NEXT_WEBAPP_ROOT = process.env.MLDONKEY_NEXT_WEBAPP_ROOT
export const MLDONKEY_CORE_WEB_PORT = parseInt(process.env.MLDONKEY_CORE_WEB_PORT) || 4080
export const MLDONKEY_CORE_TCP_PORT = parseInt(process.env.MLDONKEY_CORE_TCP_PORT) || 4001
export const MLDONKEY_CORE_HOST = process.env.MLDONKEY_CORE_HOST || "127.0.0.1"
export const MLDONKEY_NEXT_ENABLE_LOG_STREAM = process.env.MLDONKEY_NEXT_ENABLE_LOG_STREAM === "1"
export const MLDONKEY_NEXT_STANDALONE_WSS_PORT = parseInt(process.env.MLDONKEY_NEXT_STANDALONE_WSS_PORT) || null