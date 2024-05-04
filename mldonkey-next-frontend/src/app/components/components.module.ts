import { NgModule } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { InputWithIconComponent } from './input-with-icon/input-with-icon.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FontAwesomeModule,
        FormsModule
    ],
    declarations: [
        InputWithIconComponent
    ],
    exports: [
        InputWithIconComponent
    ]
})
export class ComponentsModule { }
