import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MLObservableVariable } from '../core/MLObservableVariable';

@Injectable({
    providedIn: 'root',
})
export class SpinnerService {
    public spinnerVisible: MLObservableVariable<boolean> = new MLObservableVariable<boolean>(false)

    show() {
        this.spinnerVisible.value = true
    }

    hide() {
        this.spinnerVisible.value = false
    }
}
