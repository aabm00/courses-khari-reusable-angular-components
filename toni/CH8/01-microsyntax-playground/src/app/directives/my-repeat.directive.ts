import { Directive, effect, input } from "@angular/core";

/** ANGULAR MICROSYNTAX INPUT NAMING RULE:
 * Secondary inputs MUST be named using the directive's selector as a prefix
 * followed by the parameter name in CamelCase (e.g., 'myRepeat' + 'Start' = 'myRepeatStart').
 * If you name the input simply 'start', Angular's micro-syntax parser will fail to map
 * the 'start: 6' expression from the HTML to this directive.
 */

/**
 * ANGULAR MICROSYNTAX CONTEXT EXPORT RULE:
 * This interface defines the exact data structure passed from the directive to the template.
 * - '$implicit': Maps directly to any anonymous 'let value' declaration in the HTML.
 * - Named keys ('index', 'first', 'last'): Map explicitly to variables declared with
 *   an assignment operator, such as 'let i = index', 'let isFirst = first', etc.
 */
export interface MyRepeatContext {
  readonly $implicit: number // value (implicit)
  readonly index: number
  readonly first: boolean
  readonly last: boolean
}

@Directive({
    selector: '[myRepeat]'
})
export class MyRepeat {
  readonly myRepeat = input.required<number>()
  readonly myRepeatStart = input(0)
  readonly myRepeatSkip = input(1)

  constructor() {
    effect(() => {
      console.log(`My Repeat,
        times = ${this.myRepeat()},
        start = ${this.myRepeatStart()},
        skip = ${this.myRepeatSkip()}
      `)
    })
  }
}
