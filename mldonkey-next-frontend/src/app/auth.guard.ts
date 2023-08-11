import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { MLConnectionState, WebSocketService } from './websocket-service.service'

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private websocketService: WebSocketService, private router: Router) {}
    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.websocketService.connectionState.value == MLConnectionState.S_AUTHENTICATED)
            return true
        this.router.navigateByUrl("/")
        return false
    }
}
