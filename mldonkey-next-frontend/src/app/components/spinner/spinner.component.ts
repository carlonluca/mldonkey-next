import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { SpinnerService } from '../../services/spinner.service'

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
    showSpinner = false;
    private subscription!: Subscription;

    constructor(private spinnerService: SpinnerService) { }

    ngOnInit() {
        this.subscription = this.spinnerService.spinnerVisible.observable.subscribe(
            state => (this.showSpinner = state)
        )
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    preventEventPropagation(event: Event) {
        event.stopPropagation()
        event.preventDefault()
    }
}
