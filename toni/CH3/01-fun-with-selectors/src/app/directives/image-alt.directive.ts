import { Directive, effect, input } from "@angular/core";

@Directive({
  selector: 'img[alt]',
  host: {
    '[style.cursor]': '"pointer"',
    '[attr.title]': 'alt()',
    '(mouseenter)': 'onHover($event)'

  }
})
export class ImageAlt {

  readonly alt = input('')

  onHover(event: Event) {
    const img = event.target as HTMLImageElement;
    const altText = img.alt;
    console.log(`Image alt text: ${altText}`);
  }

  constructor() {
    effect(() => {
      console.log(`El valor de alt: ${this.alt()}`)
    })
  }
}

/**
 * This directive works as transparent directive because the selector is 'img[alt]' and we don't need
 * to add nothing in the HTML. If we wanted to be more explicit it's better to change the selector to
 * 'img[alt][tooltip]' and then add to the  <img tooltip src..> so the developer knows that and directive
 * has been applyed
 */
