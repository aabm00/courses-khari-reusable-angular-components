import { Directive, input } from "@angular/core";

export interface MyForContext {
  readonly $implicit: any
  readonly index: number
  readonly first: boolean
  readonly last: boolean
  readonly odd: boolean
  readonly even: boolean
}

export type MyForTrackBy = (item: any, index: number) => any


@Directive({
    selector: '[myFor]'
})
export class MyFor {

  readonly myForOf = input.required<any[]>() // of isn't a reserved keyword in MicroSystax only let and as are.
  readonly myForTrackBy = input<MyForTrackBy>( (item, index) => item )


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
  static ngTemplateContextGuard(_: MyFor, ctx: unknown): ctx is MyForContext {
    return true;
  }

}
