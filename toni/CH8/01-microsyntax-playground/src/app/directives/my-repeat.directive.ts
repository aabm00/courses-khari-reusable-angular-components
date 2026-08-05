import { Directive, effect, input, Signal } from "@angular/core";

/** ANGULAR MICROSYNTAX INPUT NAMING RULE:
 * Secondary inputs MUST be named using the directive's selector as a prefix
 * followed by the parameter name in CamelCase (e.g., 'myRepeat' + 'Start' = 'myRepeatStart').
 * If you name the input simply 'start', Angular's micro-syntax parser will fail to map
 * the 'start: 6' expression from the HTML to this directive.

 * ANGULAR MICROSYNTAX CONTEXT EXPORT RULE:
 * This interface defines the exact data structure passed from the directive to the template.
 * - '$implicit': Maps directly to any anonymous 'let value' declaration in the HTML.
 * - Named keys ('index', 'first', 'last'): Map explicitly to variables declared with
 *   an assignment operator, such as 'let i = index', 'let isFirst = first', etc.
 *
 * $implicit and index must be of type Signal because they change their value overtime
 * first and last probably not because they don't change but we make them also Signals
 * for consistency

 * CONTRATO DE CONTEXTO REACTIVO (MYREPEAT):
 * Definimos el molde de los datos que la directiva devuelve al HTML del padre.
 * Envolvemos las propiedades en 'Signal' ya que el repetidor mutará los valores en bucle (index, last...)
 * a lo largo del tiempo, permitiendo que las vistas vinculadas se actualicen de forma óptima.
 */
export interface MyRepeatContext {
   /** Vinculado a declaraciones 'let valor' directas sin asignación en el HTML */
  readonly $implicit: Signal<number> // value (implicit)
  readonly index: Signal<number>
  readonly first: Signal<boolean>
  readonly last: Signal<boolean>

  /** Inputs passed as context
   * Clave homónima al selector requerida obligatoriamente para dar soporte al comando 'as total' */
  readonly myRepeat: Signal<number>
}

@Directive({
    selector: '[myRepeat]'
})
export class MyRepeat {
  /** INPUT PRINCIPAL: Captura la primera expresión posterior al igual (*myRepeat="5") */
  readonly myRepeat = input.required<number>()
  /** INPUTS SECUNDARIOS: Mapeados mediante concatenación camelCase desde 'start 6' y 'skip 2' */
  readonly myRepeatStart = input(0)
  readonly myRepeatSkip = input(1)

  constructor() {
    effect(() => {
      console.log(`My Repeat,
        times = ${this.myRepeat()},
        start = ${this.myRepeatStart()},
        skip = ${this.myRepeatSkip()}
      `)
    })
  }

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
  static ngTemplateContextGuard(_: MyRepeat, ctx: unknown): ctx is MyRepeatContext {
    return true;
  }
}
