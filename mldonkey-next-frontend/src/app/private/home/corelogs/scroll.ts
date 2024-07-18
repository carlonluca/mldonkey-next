import { Directive, ElementRef, AfterContentChecked } from '@angular/core'
import { uiLogger } from 'src/app/core/MLLogger';

@Directive({
    selector: '[appScrollToBottom]'
})
export class ScrollToBottomDirective implements AfterContentChecked {
    follow = true

    constructor(private el: ElementRef) { }

    ngAfterContentChecked() {
        if (this.follow)
            this.scrollToBottom()
    }

    scrollToBottom(): void {
        try {
            this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
        }
        catch (err) {
            console.error('Scroll to bottom failed:', err);
        }
    }
}
