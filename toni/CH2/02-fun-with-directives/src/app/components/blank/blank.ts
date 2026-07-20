import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'app-blank',
  imports: [],
  templateUrl: './blank.html',
  styleUrl: './blank.scss',
})
export class Blank {

  readonly color = input('teal');

  constructor() {
    effect(() => {
      console.log('Blank Component color is: ', this.color());
    })
  }

}
