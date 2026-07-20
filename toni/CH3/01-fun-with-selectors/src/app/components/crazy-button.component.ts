import { Component } from "@angular/core";


@Component({
  selector: 'button',
  host: {
    '[style.border]': '"1px solid var(--color-secondary)"'
  },
  template: `
    !! <ng-content /> CRAZY !!
  `
})
export class CrazyButton {}

/**
 * ARCHITECTURAL NOTE & PRACTICAL BEHAVIOR:
 *
 * 1. Component vs Directive: Conceptually, an Angular Component is a specialized
 *    Directive that extends its metadata to include a visual template and style encapsulation.
 *
 * 2. Native Element Overriding: By utilizing the native 'button' string as the selector,
 *    we intercept every standard HTML button in the application.
 *
 * 3. Effect: It injects a secondary border style globally via host bindings, and uses
 *    Content Projection (<ng-content />) to automatically wrap the original inner text
 *    with custom exclamation marks ("!! [Content] CRAZY !!").
 */

