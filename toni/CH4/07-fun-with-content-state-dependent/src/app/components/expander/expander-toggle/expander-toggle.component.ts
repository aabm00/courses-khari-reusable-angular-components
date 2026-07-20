import { Component, computed, inject } from "@angular/core";
import { ExpanderComponent } from "../expander.component";

// It is a transparent directive because the selector matches with the slot
// selector in  expander.html <ng-content select="[expander-toggle]" />

@Component({
  selector: '[expander-toggle]',
  templateUrl: './expander-toggle.component.html',
  styleUrl: './expander-toggle.component.scss',
  host: {
    '(click)': 'onClick()'
  }
})
export class ExpanderToggleComponent {

  /** HIERARCHICAL & SAFE INJECTION (Angular Specific - very different from Vue):
   * Because this component is placed inside <app-expander>, inject() walks up the
   * DOM tree to find the parent instance and grant direct access to its toggle() method.
   *
   * By adding '{ optional: true }', we prevent app crashes if the component is mistakenly
   * used outside an expander; 'expanderComponent' will safely resolve to 'null' instead.
   */
  readonly expanderComponent = inject(ExpanderComponent, { optional: true})

  readonly isExpanded = computed(() => this.expanderComponent?.isExpanded() === true)
  readonly isCollapsed = computed(() => this.expanderComponent?.isExpanded() === false)

  onClick() {
    // console.log('Received the click event')

    this.expanderComponent?.toggle()

  }

}

