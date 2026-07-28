import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  // SELECTOR EN CAMELCASE: Permite su uso tanto directo en <ng-template appItemTemplate>
  // como a través de la azúcar sintáctica de estrella (*appItemTemplate).
  selector: '[appItemTemplate]'
})
export class ItemTemplateDirective {

  // INYECCIÓN DE DEPENDENCIA DE LA PLANTILLA:
  // Inyecta la referencia de la plantilla donde se coloque la directiva.
  // Actualmente este token 'template' no se lee desde ningún sitio externo.
  readonly template = inject(TemplateRef<any>)
}
