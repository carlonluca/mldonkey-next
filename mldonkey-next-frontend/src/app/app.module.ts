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

/**
 * Author:  Luca Carlon
 * Company: -
 * Date: 14.08.2023
 */

import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { HomeComponent } from './private/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DownloadComponent } from './private/home/download/download.component';
import { SearchComponent } from './private/home/search/search.component';
import { ServersComponent } from './private/home/servers/servers.component';
import { StatsComponent } from './private/home/stats/stats.component';
import { OptionsComponent } from './private/home/options/options.component'
import { FormsModule } from '@angular/forms'
import { PrettyBytesPipe } from "./core/pretty-bytes.pipe";
import { SectionTitleComponent } from './private/home/section-title/section-title.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SpinnerComponent,
        HomeComponent,
        DownloadComponent,
        SearchComponent,
        ServersComponent,
        StatsComponent,
        OptionsComponent,
        SectionTitleComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatTableModule,
        MatSortModule,
        MatSidenavModule,
        FormsModule,
        PrettyBytesPipe
    ]
})
export class AppModule { }
