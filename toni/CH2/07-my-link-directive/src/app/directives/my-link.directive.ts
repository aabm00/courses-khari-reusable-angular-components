import { Directive, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";


@Directive({
  selector: '[myLink]',
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [ 'routerLink: myLink' ],
    },
    RouterLinkActive
  ]
})
export class MyLink {

  readonly myLinkActive = inject(RouterLinkActive)

  constructor() {
    this.myLinkActive.routerLinkActive = 'selected'
  }
}
