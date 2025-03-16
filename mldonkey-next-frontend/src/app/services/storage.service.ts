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

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    public static readonly KEY_LOGIN_USER = "username"
    public static readonly KEY_LOGIN_PASSWD = "passwd"

    /**
     * Returns stored login data.
     * 
     * @returns 
     */
    getLoginData(): Credentials | null {
        const username = localStorage.getItem(StorageService.KEY_LOGIN_USER)
        const passwd = localStorage.getItem(StorageService.KEY_LOGIN_PASSWD)
        if (username !== null)
            return new Credentials(username, !passwd ? null : passwd)
        return null
    }

    /**
     * Stores login data.
     * 
     * @param data 
     */
    setLoginData(credentials: Credentials | null): void {
        if (!credentials) {
            localStorage.removeItem(StorageService.KEY_LOGIN_USER)
            localStorage.removeItem(StorageService.KEY_LOGIN_PASSWD)
            return
        }

        localStorage.setItem(StorageService.KEY_LOGIN_USER, credentials.username)
        localStorage.setItem(StorageService.KEY_LOGIN_PASSWD, credentials.passwd ?? "")
    }
}

/**
 * Stores credentials.
 */
export class Credentials {
    constructor(public username: string, public passwd: string | null) { }
}
