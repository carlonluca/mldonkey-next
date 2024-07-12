import { Directive, ElementRef, AfterContentChecked } from '@angular/core'

@Directive({
    selector: '[appScrollToBottom]'
})
export class ScrollToBottomDirective implements AfterContentChecked {

    constructor(private el: ElementRef) { }

    ngAfterContentChecked() {
        this.scrollToBottom();
    }

    private scrollToBottom(): void {
        try {
            this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
        } catch (err) {
            console.error('Scroll to bottom failed:', err);
        }
    }
}
