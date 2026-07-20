
import { Directive, effect, input, linkedSignal } from "@angular/core";

// LECCIONES 17

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
  readonly color = input('', {alias: 'highlight'});

  // STYLE BINDINGS
  readonly bg = linkedSignal(() => this.color() || 'lime');

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
