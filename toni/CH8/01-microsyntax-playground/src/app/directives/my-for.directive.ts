import { Directive, input } from "@angular/core";

export interface MyForContext<T> {
  readonly $implicit: T
  readonly index: number
  readonly first: boolean
  readonly last: boolean
  readonly odd: boolean
  readonly even: boolean
}

export type MyForTrackBy<T> = (item: T, index: number) => T


@Directive({
    selector: '[myFor]'
})
export class MyFor<T> {

  readonly myForOf = input.required<T[]>() // of isn't a reserved keyword in MicroSystax only let and as are.
  readonly myForTrackBy = input<MyForTrackBy<T>>( (item, index) => item )


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
  static ngTemplateContextGuard<T>(_: MyFor<T>, ctx: unknown): ctx is MyForContext<T> {
    return true;
  }

}
