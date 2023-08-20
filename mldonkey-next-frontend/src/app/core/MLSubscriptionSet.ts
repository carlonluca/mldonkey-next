import { Subscription } from "rxjs";

export class MLSubscriptionSet {
    private subscriptions: Subscription[] = []

    add(s: Subscription) {
        this.subscriptions.push(s)
    }

    unsubscribe(s: Subscription|null) {
        if (s) {
            const index = this.subscriptions.indexOf(s, 0)
            this.subscriptions[index].unsubscribe()
            if (index > -1)
                this.subscriptions.splice(index, 1)
        }
        else {
            this.subscriptions.forEach((s) => s.unsubscribe())
            this.subscriptions = []
        }
    }
}
