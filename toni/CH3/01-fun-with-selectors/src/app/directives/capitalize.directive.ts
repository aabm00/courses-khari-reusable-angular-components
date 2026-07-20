import { Directive, inject, Renderer2 } from '@angular/core';
import { capitalizeWords } from '../utils/string.utils';

@Directive({
  selector: 'input[type="text"][capitals]',
  host: {
    '[style.border]': '"1px solid var(--color-secondary)"',
    '(blur)': 'capitalize($event)'
  }
})
export class Capitalize {

  readonly renderer = inject(Renderer2);

  capitalize(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    // input.value = input.value.toUpperCase(); // This is a simple way to capitalize the entire input value
    const value = input.value;
    const capitalizedValue = capitalizeWords(value);
    // input.value = capitalizedValue;
    this.renderer.setProperty(input, 'value', capitalizedValue);

  }
}

/**
 * Se usa Renderer2 en lugar de input.value directo para:
 *  1. Prevenir ataques XSS (sanitiza el contenido de forma nativa).
 *  2. Garantizar compatibilidad con SSR (Server-Side Rendering) al no tocar el DOM de forma imperativa.
 */

