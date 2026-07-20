import { Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander.component";

// It is a transparent directive because the selector matches with the slot
// selector in  expander.html <ng-content select="[expander-toggle]" />

@Directive({
  selector: '[expander-toggle]',
  host: {
    '(click)': 'onClick()'
  }
})
export class ExpanderToggle {

  /** HIERARCHICAL & SAFE INJECTION (Angular Specific - very different from Vue):
   * Because this directive is placed inside <app-expander>, inject() walks up the
   * DOM tree to find the parent instance and grant direct access to its toggle() method.
   *
   * By adding '{ optional: true }', we prevent app crashes if the directive is mistakenly
   * used outside an expander; 'expanderComponent' will safely resolve to 'null' instead.
   */
  readonly expanderComponent = inject(ExpanderComponent, { optional: true})

  onClick() {
    // console.log('Received the click event')

    this.expanderComponent?.toggle()

  }

}

