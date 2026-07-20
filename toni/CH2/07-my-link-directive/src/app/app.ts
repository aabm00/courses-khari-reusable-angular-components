import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MyLink } from "./directives/my-link.directive";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('my-link-directive');
}
