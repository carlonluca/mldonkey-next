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
import { UiServiceService } from 'src/app/services/ui-service.service'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-about',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatDivider,
        CommonModule
    ],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
    readonly dialogRef = inject(MatDialogRef<AboutComponent>)
    readonly version = packageJson.version
    readonly angularVersion = VERSION.full
    readonly buildInfo = build
    readonly uiService = inject(UiServiceService)
}
