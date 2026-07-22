import { Directive, effect, input, Signal } from "@angular/core";

export type TimerState = 'running' | 'done';

export interface MyTimerContext {
  readonly value: Signal<number>; // Current count
  readonly state: Signal<TimerState>;

  // Inputs passed as context
  readonly myTimer: Signal<number>
  readonly myTimerFrom: Signal<number>
}

@Directive({
    selector: '[myTimer]'
})
export class MyTimer {

  readonly myTimer = input.required<number>();
  readonly myTimerFrom = input(0);
  readonly myTimerTo = input(Infinity);
  readonly myTimerStep = input(1)


  constructor() {
    effect(() => {
      console.log(`My Timer interval,
        Timer = ${this.myTimer()},
        From = ${this.myTimerFrom()},
        To = ${this.myTimerTo()},
        Step = ${this.myTimerStep()},
      `)
    })
  }

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
  static ngTemplateContextGuard(_: MyTimer, ctx: unknown): ctx is MyTimerContext {
    return true;
  }
}
