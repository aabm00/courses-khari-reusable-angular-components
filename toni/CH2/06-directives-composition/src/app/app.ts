import { Component, signal } from '@angular/core';
import { HighlightDirective } from "../directives/hightlight.directive";
import { Blank } from './components/blank/blank';
import { UnderlineDirective } from "../directives/underline.directive";
import { DecorateDirective } from "../directives/decorate.directive";

@Component({
  selector: 'app-root',
  imports: [HighlightDirective, Blank, UnderlineDirective, DecorateDirective],
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
