import { Directive } from "@angular/core";
import { HighlightDirective } from "./hightlight.directive";
import { UnderlineDirective } from "./underline.directive";

/**
 * Host directives allow you to compose multiple directives together. This is useful when you want
 * to create a new directive that combines the functionality of existing directives.
 * In this example, we will create a new directive called `DecorateDirective` that combines the functionality
 * of the `HighlightDirective` and the `UnderlineDirective`.
 * The combined directives must be standalone, meaning they must be imported into the module where they are used.
 */

@Directive({
  selector: "[decorate]",
  hostDirectives: [
    {
      directive: HighlightDirective,
      inputs : ['highlight: decorate'], // connect, color, input in the  DecorateDirective with highlight, input in the HighlightDirective
    },
    UnderlineDirective
  ]

})
export class DecorateDirective {

}
