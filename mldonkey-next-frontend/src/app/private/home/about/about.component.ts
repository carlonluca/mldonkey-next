import { Component, inject, VERSION } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatDivider } from '@angular/material/divider'
import { UiServiceService } from 'src/app/services/ui-service.service'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import {
    MatDialogRef,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from '@angular/material/dialog'
import packageJson from '../../../../../package.json'
import build from '../../../../build'
import { MLUtils } from 'src/app/core/MLUtils'

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
    readonly router = inject(Router)
    readonly route = inject(ActivatedRoute)

    public hrefClicked(event: Event, url: string) {
        if (MLUtils.isWebView()) {
            event.preventDefault()
            this.navigate(undefined)
            setTimeout(() => this.navigate(url), 100)
        }
    }

    private navigate(url: string | undefined) {
        const newParam = url ? { openUrl: this.stringToHex(url) } : {}
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: newParam,
            queryParamsHandling: 'replace'
        })
    }

    private stringToHex(str: string): string {
        return str
            .split('')
            .map((char) => char.charCodeAt(0).toString(16))
            .join('')
    }
}
