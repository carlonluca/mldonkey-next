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

    private scrollToBottom(): void {
        try {
            this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
        }
        catch (err) {
            console.error('Scroll to bottom failed:', err);
        }
    }

    private isScrolledToBottom(): boolean {
        const threshold = 5
        const scrollTop = this.el.nativeElement.scrollTop
        const scrollHeight = this.el.nativeElement.scrollHeight
        const clientHeight = this.el.nativeElement.clientHeight
        uiLogger.debug("scroll:", scrollHeight, scrollTop, clientHeight, threshold)
        return scrollHeight - scrollTop - clientHeight - threshold < 1
    }
}
