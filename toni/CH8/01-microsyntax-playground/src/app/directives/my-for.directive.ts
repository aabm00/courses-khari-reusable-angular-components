import { Directive, input } from "@angular/core";

/**
 * CONTRATO DE CONTEXTO PARA EL BUCLE GENÉRICO (MYFOR):
 * Emula el comportamiento estático del *ngFor de Angular.
 * El tipo <T> representa la estructura de un ítem individual de la colección.
 */
export interface MyForContext<T> {
  /** Elemento principal asignado de forma implícita a la directiva bare 'let item' */
  readonly $implicit: T
  readonly index: number
  readonly first: boolean
  readonly last: boolean
  readonly odd: boolean
  readonly even: boolean
}

/** Firma genérica para la función de rastreo y optimización del bucle */
export type MyForTrackBy<T> = (item: T, index: number) => T


@Directive({
    selector: '[myFor]'
})
export class MyFor<T> {
  /**
   * INPUT SECUNDARIO COMPUESTO (myFor + Of):
   * Recibe la colección completa de datos desde la instrucción 'of items()'.
   * Al tiparse como 'T[]', se convierte en el ancla principal de inferencia para toda la clase.
   */
  readonly myForOf = input.required<T[]>() // of isn't a reserved keyword in MicroSystax only let and as are.
  /** Input secundario opcional encargado del trackeo de elementos */
  readonly myForTrackBy = input<MyForTrackBy<T>>( (item, index) => item )


  /**
   * TEMPLATE CONTEXT GUARD (Strict HTML Type Checking):
   *
   * - Purpose: Binds the 'MyRepeatContext' interface directly to the HTML template.
   *   Without this, variables like 'let value' or 'let i = index' would be typed
   *   as 'any', losing autocomplete and risking silent runtime typos.
   *
   * - When to use: ALWAYS include this method when building custom structural
   *   directives that export data back to the template using context variables.
   */
  static ngTemplateContextGuard<T>(_: MyFor<T>, ctx: unknown): ctx is MyForContext<T> {
    return true;
  }

}
