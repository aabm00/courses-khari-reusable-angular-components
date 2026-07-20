import { Directive, inject, InjectionToken, Provider } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

/**
 * This is part of the second partt of the challenge: Allow to Customize the Active Class
 * See the README.md file for more details.
 */
export const MY_LINK_ACTIVE_CLASS = new InjectionToken<string>('MY_LINK_ACTIVE_CLASS')

export function provideMyLinkActiveClass(className: string): Provider {
  return {
    provide: MY_LINK_ACTIVE_CLASS,
    useValue: className
  }
}

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

  readonly className = inject(MY_LINK_ACTIVE_CLASS, {optional: true})

  constructor() {
    this.myLinkActive.routerLinkActive = this.className || 'selected'
  }
}
