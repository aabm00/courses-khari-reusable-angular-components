import { Directive, inject, TemplateRef } from '@angular/core';

/**
 * CONTRATO DE CONTEXTO ENRIQUECIDO:
 * A diferencia del contexto básico, este contrato expone un set completo de propiedades de contexto
 * para que el consumidor pueda gobernar la interactividad y los estados visuales desde fuera.
 */
export interface ItemContainerContext {
  readonly $implicit: string;     /** El string de la opción iterada actual (ej: 'red'), valor implicito */
  readonly isSelected: boolean;   /** Flag reactivo que indica si esta opción específica está activa */
  readonly onSelect: () => void;  /** Callback para notificar que el usuario ha clicado la opción */
}

@Directive({
  selector: '[appItemContainer]'
})
export class ItemContainerDirective {
  /**
   * INYECCIÓN TIPADA DE LA PLANTILLA DEL CONTENEDOR:
   * Al colocar '[appItemContainer]' sobre un elemento con asterisco (*), Angular captura el
   * 'TemplateRef' de ese bloque de código y lo asocia estrictamente a los tipos de 'ItemContainerContext'.
   */
  readonly template = inject(TemplateRef<ItemContainerContext>);

  /**
   * GUARDIÁN ESTÁTICO DE TIPOS PARA EL COMPILADOR (NG TEMPLATE CONTEXT GUARD):
   * Este método estático no ejecuta código en tiempo de ejecución (runtime = 0 coste).
   * Su único propósito es actuar como un gancho para el validador de plantillas de Angular.
   * La instrucción 'ctx is ItemContainerContext' (un predicado de tipo de TypeScript) le afirma
   * al compilador que las variables declaradas en el HTML externo mediante 'let-' adoptarán
   * de forma estricta los tipos definidos en la interfaz (string, boolean y función).
   * Gracias a esto, el desarrollador obtiene autocompletado nativo y detección de errores en el HTML.
   */
  static ngTemplateContextGuard( _: ItemContainerDirective, ctx: unknown): ctx is ItemContainerContext {
    return true;
  }
}
