import { computed, Directive, ElementRef, inject, Renderer2, signal } from "@angular/core";

// CH02 - LECCIONES 1 a 14

/** 1. MALA IMPLEMENTACION
 * Angular puede Estar siendo renderizada en el servidor Por lo tanto, la propiedad nativeElement no existiría
 * Además, angular también permite usar Otros frameworks como Ionic para Mobile Para Usar Funcionalidades nativas
 * del móvil, por lo tanto, en este caso tampoco tendríamos esta propiedad nativeElement, por lo tanto, esta no es
 * la mejor implementación que podemos hacer en una directiva.
 *
 * Los corchetes significan selector de atributo CSS. Indica que la directiva no es una etiqueta nueva,
 * sino un comportamiento que se aplica como un atributo dentro de cualquier etiqueta existente
 * (ej: <p highlight>Texto</p>).
 */
// @Directive({
//   selector: "[highlight]"
// })
// export class HighlightDirective {

//   readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

//   constructor() {
//     console.log("Highlight Directive was created");
//     this.hostElement.nativeElement.style.backgroundColor = "yellow";
//   }
// }

/** 2. MENOS MALA IMPLEMENTACION
 * Esta versión es mejor que la anterior, pero No es la mejor implementación porque esto es código imperativo.
 * Es mejor que la versión anterior porque estamos utilizando servicios de angular para cambiar el estilo.
 * No accedemos directamente al DOM. La mejor implementación es con código declarativo Que será la próxima versión
 * que usa El mecanismo Angular binding.
 */
// @Directive({
//   selector: "[highlight]"
// })
// export class HighlightDirective {

//   readonly hostElement =inject(ElementRef);
//   readonly renderer = inject(Renderer2);

//   constructor() {
//     console.log("Highlight Directive was created");
//     this.renderer.setStyle(this.hostElement.nativeElement, "background-color", "pink");
//   }
// }

/** 3. MEJOR IMPLEMENTACION
 * Con este método Angular está totalmente sincronizado con el DOM. Angular se encarga de actualizar el DOM cuando
 * sea necesario. Si se cambia el valor asignado al background automáticamente se actualizará el DOM.
 * Esto es lo que se llama código declarativo.
 */
@Directive({
  selector: "[highlight]",
  host: {
    // STYLE BINDINGS
    '[style.backgroundColor]': 'bg()',
    '[style.border]': '"0px solid blue"',
    '[style.border-bottom-width.px]': 'thickness()',
    '[style.--my-property.pt]': 'thickness()',
    '[style.cursor]': '"pointer"',

    // ATTRIBUTE BINDINGS
    '[attr.title]': '"This is a title"',
    '[attr.contenteditable]': 'true',
    '[attr.tabindex]': '0', // Make the element focusable

    // CLASS BINDINGS
    '[class.highlighted]': 'isHighlighted()',
    '[class.was-highlighted]': '!isHighlighted()',
    '[class]': 'bgClass()',

    // EVENT BINDINGS
    '(click)': 'changeColor()',
    '(keyup)': 'onKeyPress($event)',
    '(keyup.shift.enter)': 'onEnterPress($event)'
  }
})
export class HighlightDirective {

  // STYLE BINDINGS
  readonly bg = signal('lime');
  readonly thickness = signal(3);

  // CLASS BINDINGS
  readonly isHighlighted = signal(true);
  readonly bgClass = computed(() => `${this.bg()}-highlight`);

  // EVENT BINDINGS
  changeColor() {
    this.bg.set('cyan')
  }

  onKeyPress(event: KeyboardEvent) {
    console.log(`Key pressed: ${event.code}`);
  }

  onEnterPress(event: Event) {
    this.bg.set('yellow');
  }

  constructor() {
    setTimeout(() => {
      this.bg.set('orange')
      this.isHighlighted.set(false)
    }, 3000);
  }

}
