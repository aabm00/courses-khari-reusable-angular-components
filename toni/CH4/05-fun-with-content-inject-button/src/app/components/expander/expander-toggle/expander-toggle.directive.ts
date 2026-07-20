import { Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander";

// It is a transparent directive because the selector matches with the slot
// selector in  expander.html <ng-content select="[expander-toggle]" />

@Directive({
  selector: '[expander-toggle]',
  host: {
    '(click)': 'onClick()'
  }
})
export class ExpanderToggle {

  /** HIERARCHICAL INJECTION (Angular Specific - very different from Vue):
   * Because this directive will be placed inside <app-expander> in the HTML,
   * inject() automatically walks up the DOM tree, finds the parent instance,
   * and grants us direct access to its public api (like the toggle() method).
   */
  readonly expanderComponent = inject(ExpanderComponent)

  onClick() {
    // console.log('Received the click event')

    this.expanderComponent.toggle()

  }

}

