import { Directive, input } from "@angular/core";

/**
 * INTERFAZ DE CONTEXTO CON SOPORTE DE TIPADO TRUTHY GENÉRICO:
 * Usamos el genérico <T> para capturar la naturaleza exacta de la expresión evaluada.
 */
export interface MyIfContext<T> {
  // Inputs passed as context
  /**
   * Clave idéntica al selector de la directiva. Permite el uso de '*myIf="value() as ourVal"'.
   * Al mapear el tipo exacto <T>, si la expresión es 'string | null', el contexto sabrá
   * que cuando el bloque se pinte, el valor será estrictamente la string limpia (no nula).
   */
  readonly myIf: T
}


@Directive({
    selector: '[myIf]'
})
export class MyIf<T> {
  /**
   * Input principal tipado con genéricos.
   * Al no restringirse a 'boolean', tolera la evaluación de objetos o cadenas en condiciones truthy/falsy.
   */
  readonly myIf = input.required<T>() // Because it must accept truty values not only booleans


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
  static ngTemplateContextGuard<T>(_: MyIf<T>, ctx: unknown): ctx is MyIfContext<T> {
    return true;
  }

}
