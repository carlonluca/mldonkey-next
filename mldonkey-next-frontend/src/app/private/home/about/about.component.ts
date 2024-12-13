import { Component, inject, VERSION } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
    MatDialogRef,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog'
import packageJson from '../../../../../package.json'
import build from "../../../../build"
import { MatDivider } from '@angular/material/divider'

@Component({
    selector: 'app-about',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatDivider
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
    readonly dialogRef = inject(MatDialogRef<AboutComponent>)
    readonly version = packageJson.version
    readonly angularVersion = VERSION.full
    readonly buildInfo = build
}
