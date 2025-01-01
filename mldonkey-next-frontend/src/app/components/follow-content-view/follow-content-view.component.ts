import { Component, ElementRef, ViewChild } from '@angular/core'
import { faArrowUp, faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons'
import { ScrollToBottomDirective } from 'src/app/private/home/corelogs/scroll'

@Component({
    selector: 'app-follow-content-view',
    templateUrl: './follow-content-view.component.html',
    styleUrl: './follow-content-view.component.scss',
    standalone: false
})
export class FollowContentViewComponent {
    @ViewChild('scrollContainer') scrollContainer: ElementRef
    @ViewChild("contentSection") contentSection: ElementRef
    @ViewChild(ScrollToBottomDirective) scrollDirective: ScrollToBottomDirective

    faPersonWalkingArrowRight = faPersonWalkingArrowRight
    faArrowUp = faArrowUp
    follow = true

    onScroll(_event: WheelEvent) {
        this.dontFollow()
    }

    doFollow() {
        this.scrollDirective.follow = true
        this.follow = true
        this.scrollToBottom()
    }

    scrollToTop() {
        this.dontFollow()
        this.scrollContainer.nativeElement.scrollTop = 0
    }

    scrollToBottom() {
        if (this.scrollDirective)
            this.scrollDirective.scrollToBottom()
    }

    dontFollow() {
        this.scrollDirective.follow = false
        this.follow = false
    }

    isAtTop() {
        if (!this.scrollContainer)
            return true
        return this.scrollContainer.nativeElement.scrollTop === 0
    }
}
