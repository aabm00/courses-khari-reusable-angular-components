import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRepeat } from "./directives/my-repeat.directive";

@Component({
  selector: 'app-root',
  imports: [CommonModule, MyRepeat],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly count = signal(5);

  readonly start = signal(0);

  readonly skip = signal(1);

  incrementCount() {
    this.count.update(v => v + 1);
  }

  decrementCount() {
    this.count.update(v => Math.max(v - 1, 0));
  }

  incrementSkip() {
    this.skip.update(v => v + 1);
  }

  decrementSkip() {
    this.skip.update(v => Math.max(v - 1, 1));
  }

  incrementStart() {
    this.start.update(v => v + 1);
  }

  decrementStart() {
    this.start.update(v => v - 1);
  }
}
