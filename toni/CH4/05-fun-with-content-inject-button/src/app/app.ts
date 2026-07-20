import { Component } from '@angular/core';
import { ExpanderComponent } from './components/expander/expander';
import { Icon } from './components/icon/icon';
import { ExpanderToggle } from './components/expander/expander-toggle/expander-toggle.directive';

@Component({
  selector: 'app-root',
  imports: [ExpanderComponent, Icon, ExpanderToggle],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
