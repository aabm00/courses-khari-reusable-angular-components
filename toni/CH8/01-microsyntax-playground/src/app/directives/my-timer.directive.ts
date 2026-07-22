import { Directive, effect, input } from "@angular/core";

export type TimerState = 'running' | 'done';

export interface MyTimerContext {
  readonly value: number; // Current count
  readonly state: TimerState;
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

}
