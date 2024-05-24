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

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { HomeComponent } from './private/home/home.component'
import { AuthGuard } from './auth.guard'
import { DownloadComponent } from './private/home/download/download.component'
import { SearchComponent } from './private/home/search/search.component'
import { ServersComponent } from './private/home/servers/servers.component'
import { StatsComponent } from './private/home/stats/stats.component'
import { OptionsComponent } from './private/home/options/options.component'
import { PublicComponent } from './public/public.component'
import { ConsoleComponent } from './private/home/console/console.component'

const routes: Routes = [
    {
        path: "",
        loadChildren: () => import("./public/public.module").then(m => m.PublicModule)
    },
    {
        path: "login",
        component: PublicComponent
    },
    {
        path: "home",
        component: HomeComponent,
        canActivate: [ AuthGuard ],
        children: [{
            path: "",
            canActivate: [ AuthGuard ],
            component: DownloadComponent
        }, {
            path: "download",
            canActivate: [ AuthGuard ],
            component: DownloadComponent
        }, {
            path: "search",
            canActivate: [ AuthGuard ],
            component: SearchComponent
        }, {
            path: "servers",
            canActivate: [ AuthGuard ],
            component: ServersComponent
        }, {
            path: "stats",
            canActivate: [ AuthGuard ],
            component: StatsComponent
        }, {
            path: "options",
            canActivate: [ AuthGuard ],
            component: OptionsComponent
        }, {
            path: "console",
            canActivate: [ AuthGuard ],
            component: ConsoleComponent
        }]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
