import { Directive, inject } from "@angular/core";
import { Expander } from './expander';
import { ExpanderComponent } from "./expander.component";


@Directive({
  selector: '[expander-header][toggle]',
  host: {
    '[style.cursor]': '"pointer"',
    '(click)': 'onClick()'
  }

})
export class ExpanderHeaderToggleDirective {

  readonly expander = inject(ExpanderComponent, {optional: true})

  onClick() {
    this.expander?.toggle();
  }
}
