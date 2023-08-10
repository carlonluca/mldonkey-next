import { BehaviorSubject } from "rxjs";

/**
 * A variable that can be observed.
 */
export class MLObservableVariable<T> {
    public observable: BehaviorSubject<T>
    constructor(private defaultValue: T) {
        this.observable = new BehaviorSubject<T>(this.defaultValue)
    }
    set value(v: T) {
        this.observable.next(v)
    }
    get value(): T {
        return this.observable.value
    }
}
