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
 * Date:    2023.08.14
 */

import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SpinnerComponent } from './components/spinner/spinner.component'
import { HomeComponent } from './private/home/home.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { DownloadComponent } from './private/home/download/download.component'
import { SearchComponent } from './private/home/search/search.component'
import { ServersComponent } from './private/home/servers/servers.component'
import { StatsComponent } from './private/home/stats/stats.component'
import { OptionsComponent } from './private/home/options/options.component'
import { FormsModule } from '@angular/forms'
import { PrettyBytesPipe, PrettyBytesSpeedPipe } from "./core/pretty-bytes.pipe"
import { PrettySecsPipe, PrettySecsShortPipe } from "./core/pretty-time.ppe"
import { SectionTitleComponent } from './private/home/section-title/section-title.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSelectModule } from '@angular/material/select'
import { MatMenuModule } from '@angular/material/menu'
import { MatTabsModule } from '@angular/material/tabs'
import { MatChipsModule } from '@angular/material/chips'
import { OptionSectionComponent } from './private/home/options/option-section/option-section.component'
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask'
import { OptionElementsComponent } from './private/home/options/option-elements/option-elements.component'
import { ConsoleComponent } from './private/home/console/console.component'
import { SysInfoComponent } from './private/home/sysinfo/sysinfo.component'
import { CorelogsComponent } from './private/home/corelogs/corelogs.component'
import { ScrollToBottomDirective } from './private/home/corelogs/scroll'
import { MatDividerModule } from '@angular/material/divider'
import { TurtleIconComponent } from './components/turtle-icon/turtle-icon.component'
import { SpeedIndicatorComponent } from './private/home/download/speed-indicator/speed-indicator.component'
import { NgxEchartsModule } from 'ngx-echarts'
import { RouterModule } from '@angular/router'
import { ComponentsModule } from "./components/components.module";

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent,
        HomeComponent,
        DownloadComponent,
        SearchComponent,
        ServersComponent,
        StatsComponent,
        OptionsComponent,
        SectionTitleComponent,
        OptionSectionComponent,
        OptionElementsComponent,
        ConsoleComponent,
        SysInfoComponent,
        CorelogsComponent,
        ScrollToBottomDirective,
        TurtleIconComponent,
        SpeedIndicatorComponent
    ],
    providers: [
        provideNgxMask()
    ],
    bootstrap: [AppComponent],
    imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatSidenavModule,
    FormsModule,
    PrettyBytesPipe,
    PrettyBytesSpeedPipe,
    PrettySecsPipe,
    FontAwesomeModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMenuModule,
    MatTabsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    MatChipsModule,
    MatDividerModule,
    PrettySecsShortPipe,
    RouterModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') }),
    ComponentsModule
],
    exports: [
        ScrollToBottomDirective
    ]
})
export class AppModule { }
