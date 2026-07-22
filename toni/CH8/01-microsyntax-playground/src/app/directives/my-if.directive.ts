import { Directive, input } from "@angular/core";

export interface MyIfContext<T> {
  // Inputs passed as context
  readonly myIf: T
}


@Directive({
    selector: '[myIf]'
})
export class MyIf<T> {

  readonly myIf = input.required<T>() // Because it must accept truty values not only booleans


  /**
   * TEMPLATE CONTEXT GUARD (Strict HTML Type Checking):
   *
   * - Purpose: Binds the 'MyRepeatContext' interface directly to the HTML template.
   *   Without this, variables like 'let value' or 'let i = index' would be typed
   *   as 'any', losing autocomplete and risking silent runtime typos.
   *
   * - When to use: ALWAYS include this method when building custom structural
   *   directives that export data back to the template using context variables.
   */
  static ngTemplateContextGuard<T>(_: MyIf<T>, ctx: unknown): ctx is MyIfContext<T> {
    return true;
  }

}
