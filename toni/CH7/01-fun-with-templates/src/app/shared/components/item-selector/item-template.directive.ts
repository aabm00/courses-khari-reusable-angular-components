import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appItemTemplate]'
})
export class ItemTemplateDirective {

  /**
   * CONEXIÓN OPERATIVA CONSOLIDADA:
   * Al colocar esta directiva en un <ng-template>, este token almacena la referencia HTML.
   * El componente 'ItemSelectorComponent' ahora lee esta propiedad exacta gracias al cambio en su query.
   */
  readonly template = inject(TemplateRef<any>)

}
