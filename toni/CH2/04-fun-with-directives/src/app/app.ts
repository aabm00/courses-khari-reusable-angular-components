import { Component, signal } from '@angular/core';
import { HighlightDirective } from "../directives/hightlight.directive";
import { Blank } from './components/blank/blank';

@Component({
  selector: 'app-root',
  imports: [HighlightDirective, Blank],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {

  readonly myColor = signal('magenta');

  onDeactivation(timeLenght: number) {
    const seconds = (timeLenght / 1000).toFixed(2)
    console.log(`Highlight deactivated after ${seconds} seconds`)
  }
}
