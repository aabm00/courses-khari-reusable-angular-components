import { Directive, ElementRef, inject, signal } from "@angular/core";
import { clamp } from "./helpers";

// CH02 - LECCIONES 21


@Directive({
  selector: '[track-mouse]',

  host: {
    // EVENT BINDING Escucha el movimiento del ratón de forma nativa en el elemento anfitrión.
    '(mousemove)': 'mouseMoved($event)',

    // ======================================================================================
    // PUENTE REACTIVO: ANGULAR A PROPIEDADES CUSTOM DE CSS (CSS VARIABLES)
    // ======================================================================================
    // Cada vez que los Signals x() o y() se actualizan, Angular muta DIRECTAMENTE los estilos
    // en línea del elemento HTML anfitrión, creando o actualizando las variables CSS nativas
    // '--mouse-x' y '--mouse-y'.
    //
    // Esto expone el estado del componente al árbol de estilos (CSS/SCSS) sin que el CSS
    // tenga que saber absolutamente nada sobre TypeScript, Signals o Angular.
    // ======================================================================================
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
