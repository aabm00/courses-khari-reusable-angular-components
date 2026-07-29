import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * CONTRATO DE CONTEXTO BÁSICO PARA EL TEXTO INTERNO (TIER 2):
 * Esta interfaz define la estructura de datos simplificada para personalizar únicamente
 * el contenido interior del chip, limitándose a proveer el valor de la opción actual.
 */
export interface ItemTemplateContext {
  /** El string de la opción iterada actual que se asignará a la variable 'let-variable' sin nombre. */
  readonly $implicit: string
}

@Directive({
  selector: '[appItemTemplate]'
})
export class ItemTemplateDirective {

  /**
   * REFERENCIA DE PLANTILLA PARA CONTENIDO INTERNO:
   * Captura el 'TemplateRef' del bloque y lo tipa bajo las reglas estrictas de 'ItemTemplateContext'.
   */
  readonly template = inject(TemplateRef<ItemTemplateContext>)

  /**
   * GUARDIÁN ESTÁTICO DE TIPOS PARA EL CONTENIDO INTERNO:
   * Al igual que en el contenedor, este método le afirma al motor de comprobación de Angular
   * que cualquier variable capturada mediante 'let-' en esta directiva es estrictamente un 'string'.
   * Proteje al desarrollador de cometer errores de tipado o llamadas a propiedades inexistentes.
   */
  static ngTemplateContextGuard( _: ItemTemplateDirective, ctx: unknown): ctx is ItemTemplateContext {
    return true
  }
}
