import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyTimer } from "./directives/my-timer.directive";

@Component({
  selector: 'app-root',
  imports: [CommonModule, MyTimer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  readonly int = signal(2000);
  readonly step = signal(1);

  incrementInterval() {
    this.int.update(v => v + 250);
  }

  decrementInterval() {
    this.int.update(v => v - 250);
  }

  incrementStep() {
    this.step.update(v => v + 1);
  }

  decrementStep() {
    this.step.update(v => Math.max(v - 1, 1));
  }
}
