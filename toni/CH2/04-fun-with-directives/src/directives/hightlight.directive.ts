
import { computed, Directive, input, output, signal } from "@angular/core";

// CH02 - LECCIONES 18 a 20

/**
 * La propiedad exportAs: 'highlight' sirve para exportar la instancia de tu directiva
 * hacia la plantilla HTML, permitiéndote crear una variable local para controlar su
 * estado, leer sus señales o ejecutar sus métodos directamente desde el HTML, sin pasar
 * por el archivo TypeScript del componente padre.
*/

@Directive({
  selector: "[highlight]",
  host: {
    // STYLE BINDINGS
    '[style.backgroundColor]': 'bg()',
    '[style.cursor]': '"pointer"',

    // EVENT BINDINGS
    '(click)': 'toggleActive()',

  },
  exportAs: 'highlight'

})
export class HighlightDirective {

  // STATE
  readonly isActive = signal(false);

  // IMPUTS BINDINGS
  readonly color = input('', {alias: 'highlight'});

  // OUTPUTS BINDINGS
  readonly highlightActivated = output<void>()
  readonly highlightDeactivated = output<number>()

  #activationTime = -1

  // STYLE BINDINGS
  readonly bg = computed(() => this.isActive() ? 'pink' : (this.color() || 'lime'));

  // EVENT BINDINGS
  toggleActive() {
    this.isActive.update( v => !v)

    if (this.isActive()) {
      this.highlightActivated.emit()
      this.#activationTime = Date.now()
    } else {
      const timeSince = Date.now() - this.#activationTime
      this.#activationTime = -1
      this.highlightDeactivated.emit(timeSince)
    }
  }

}
