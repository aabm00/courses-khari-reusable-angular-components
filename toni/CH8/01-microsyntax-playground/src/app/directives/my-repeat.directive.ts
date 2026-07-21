import { Directive, effect, input } from "@angular/core";

/** ANGULAR MICROSYNTAX INPUT NAMING RULE:
 * Secondary inputs MUST be named using the directive's selector as a prefix
 * followed by the parameter name in CamelCase (e.g., 'myRepeat' + 'Start' = 'myRepeatStart').
 * If you name the input simply 'start', Angular's micro-syntax parser will fail to map
 * the 'start: 6' expression from the HTML to this directive.
 */


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
