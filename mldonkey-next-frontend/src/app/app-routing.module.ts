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
import { SysInfoComponent } from './private/home/sysinfo/sysinfo.component'
import { CorelogsComponent } from './private/home/corelogs/corelogs.component'
import { UploadComponent } from './private/home/upload/upload.component'
import { HelpComponent } from './private/home/help/help.component'
import { SharedFilesComponent } from './private/home/sharedfiles/sharedfiles.component'
import { DownloadDetailsComponent } from './private/home/download/download-details/download-details.component'
import { SearchHistoryComponent } from './private/home/search/search-history/search-history.component'

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
            path: "upload",
            canActivate: [ AuthGuard ],
            component: UploadComponent
        }, {
            path: "sharedfiles",
            canActivate: [ AuthGuard ],
            component: SharedFilesComponent
        }, {
            path: "search",
            canActivate: [ AuthGuard ],
            component: SearchComponent
        }, {
            path: "search-history",
            canActivate: [ AuthGuard ],
            component: SearchHistoryComponent
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
        }, {
            path: "sysinfo",
            canActivate: [ AuthGuard ],
            component: SysInfoComponent
        }, {
            path: "corelogs",
            canActivate: [ AuthGuard ],
            component: CorelogsComponent
        }, {
            path: "help",
            canActivate: [ AuthGuard ],
            component: HelpComponent
        }, {
            path: "download-details",
            canActivate: [ AuthGuard ],
            component: DownloadDetailsComponent
        }]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes,{useHash:true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
