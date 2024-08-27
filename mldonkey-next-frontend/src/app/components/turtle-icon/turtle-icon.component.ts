import { AfterViewInit, Component, ElementRef, Renderer2 } from '@angular/core'

@Component({
    selector: 'app-turtle-icon',
    templateUrl: '../../../assets/turtle.svg',
    styleUrls: ['./turtle-icon.component.scss']
})
export class TurtleIconComponent implements AfterViewInit {
    fillColor = 'rgb(255, 255, 255)'
    
    constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit(): void {
        // Set width and height dynamically in pixels
        const svgElement = this.elRef.nativeElement.querySelector('svg')

        // Get the computed style of the element
        const computedStyle = getComputedStyle(this.elRef.nativeElement)
        const fontSize = parseFloat(computedStyle.fontSize)

        // Set the SVG's width and height using Renderer2
        this.renderer.setAttribute(svgElement, 'width', `${fontSize*1.5}`)
        this.renderer.setAttribute(svgElement, 'height', `${fontSize*0.7}`)
    }

    changeColor() {
        const r = Math.floor(Math.random() * 256)
        const g = Math.floor(Math.random() * 256)
        const b = Math.floor(Math.random() * 256)
        this.fillColor = `rgb(${r}, ${g}, ${b})`
    }
}
