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
        if (username && passwd)
            return new Credentials(username, passwd)
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
        localStorage.setItem(StorageService.KEY_LOGIN_PASSWD, credentials.passwd)
    }
}

/**
 * Stores credentials.
 */
export class Credentials {
    constructor(public username: string, public passwd: string) { }
}
