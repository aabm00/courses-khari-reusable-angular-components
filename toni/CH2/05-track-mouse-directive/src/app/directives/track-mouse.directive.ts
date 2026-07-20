import { Directive, ElementRef, inject, signal } from "@angular/core";
import { clamp } from "./helpers";

// CH02 - LECCIONES 21


@Directive({
  selector: '[track-mouse]',
  host: {
    // EVENT BINDING
    '(mousemove)': 'mouseMoved($event)',

    // CSS VARS BINDING
    '[style.--mouse-x.px]': 'x()',
    '[style.--mouse-y.px]': 'y()'

  },
  exportAs: 'track-mouse'
})
export class TrackMouse {

  readonly x = signal(0)
  readonly y = signal(0)

  readonly elem = inject(ElementRef).nativeElement as HTMLElement

  mouseMoved = (event: MouseEvent) => {
    // console.log('mouse moved', event)

    const rect = this.elem.getBoundingClientRect() // get the size of the element and its position relative to the viewport
    const x = event.clientX - rect.left // get the x position of the mouse relative to the element
    const y = event.clientY - rect.top  // get the y position of the mouse relative to the element

    this.x.set(clamp(0, x, rect.width))  // clamp the x position to be within the bounds of the element
    this.y.set(clamp(0, y, rect.height)) // clamp the y position to be within the bounds of the element

    console.log('mouse moved', this.x(), this.y())
  }
}
