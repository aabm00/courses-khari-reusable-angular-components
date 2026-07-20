
import { Directive, effect, input, linkedSignal } from "@angular/core";

// CH02 - LECCIONES 15 y 16

@Directive({
  selector: "[highlight]",
  host: {
    // STYLE BINDINGS
    '[style.backgroundColor]': 'bg()',
    '[style.cursor]': '"pointer"',

    // EVENT BINDINGS
    '(click)': 'changeColor()',

  }
})
export class HighlightDirective {

  // IMPUTS BINDINGS
  readonly color = input('lime');

  // STYLE BINDINGS
  readonly bg = linkedSignal(this.color);

  // EVENT BINDINGS
  changeColor() {
    this.bg.set('cyan')
  }

    constructor() {
    effect(() => {
      console.log('Highlight Directive color is: ', this.color());
    })
  }
}
