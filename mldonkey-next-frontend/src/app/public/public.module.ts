import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PublicRoutingModule } from './public-routing.module'
import { PublicComponent } from './public.component'
import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'

@NgModule({
    declarations: [
        PublicComponent
    ],
    imports: [
        CommonModule,
        PublicRoutingModule,
        RouterModule,
        FormsModule
    ]
})
export class PublicModule {}
