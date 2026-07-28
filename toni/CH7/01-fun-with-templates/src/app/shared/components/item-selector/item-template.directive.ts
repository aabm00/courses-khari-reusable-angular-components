import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * DEFINICIÓN DEL CONTRATO DE DATOS INTERNO:
 * Interfaces que moldean de forma inmutable las propiedades del contexto de la plantilla.
 * '$implicit' mapea de forma nativa a cualquier declaración 'let-variable' sin nombre asignado.
 */
export interface ItemTemplateContext {
  readonly $implicit: string
}

@Directive({
  selector: '[appItemTemplate]'
})
export class ItemTemplateDirective {

  /**
   * INYECCIÓN ASOCIATIVA Y TIPADA:
   * Al pasar la interfaz genérica 'TemplateRef<ItemTemplateContext>', aseguramos que
   * la referencia capturada exija un objeto de contexto que cumpla rigurosamente con el contrato.
   */
  readonly template = inject(TemplateRef<ItemTemplateContext>)

  /**
   * GUARDIÁN DE CONTEXTO DE PLANTILLA (MÁXIMA SEGURIDAD ESTÁTICA):
   * Este método estático actúa como un puente de validación para el validador de tipos de Angular.
   * El primer parámetro ignora la instancia de la directiva ('_'), y el segundo recibe el contexto desconocido.
   * El truco de magia está en el retorno 'ctx is ItemTemplateContext' (Predicado de Tipo de TypeScript):
   * Le afirma al compilador que la evaluación es verdadera en fase de compilación.
   * Gracias a esto, al posar el cursor sobre '*appItemTemplate="let color"', el IDE ya no dirá 'any', dirá 'string'.
   */
  static ngTemplateContextGuard( _: ItemTemplateDirective, ctx: unknown): ctx is ItemTemplateContext {
    return true
  }
}
