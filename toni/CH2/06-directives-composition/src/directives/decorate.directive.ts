import { Directive } from "@angular/core";
import { HighlightDirective } from "./hightlight.directive";
import { UnderlineDirective } from "./underline.directive";

/**
 * =========================================================================================
 * PATRÓN ARQUITECTÓNICO: COMPOSICIÓN DE COMPORTAMIENTOS MEDIANTE 'HOSTDIRECTIVES'
 * =========================================================================================
 * Permite fusionar múltiples directivas standalone sin usar herencia clásica ('extends'),
 * evitando la herencia única de TypeScript y la contaminación de atributos en el HTML.
 *
 * -----------------------------------------------------------------------------------------
 * ¿CÓMO SE CONECTAN LOS INPUTS? (DESMITIFICANDO LA SINTAXIS 'highlight: decorate')
 * -----------------------------------------------------------------------------------------
 * La sintaxis sigue la regla estricta: ['InputPublicoHijo : InputPublicoPadre']
 *
 * 1. En 'HighlightDirective', la propiedad interna se llama 'color', pero se expone al mundo
 *    exterior bajo el alias público 'highlight' -> ( input('', {alias: 'highlight'}) ).
 *
 * 2. Angular, en 'hostDirectives', NO conoce las variables internas (como 'color'). Solo ve
 *    los nombres públicos expuestos. Por eso usamos 'highlight' a la izquierda de los dos puntos.
 *
 * 3. Al declarar ['highlight: decorate'], estamos creando una tubería (pipeline):
 *    Cuando el usuario escribe en HTML: <div decorate="cyan">...</div>
 *    - El valor "cyan" entra por el input padre 'decorate'.
 *    - Angular lo redirige al input público de la directiva hija 'highlight'.
 *    - Finalmente, el alias interno de la hija deposita el valor "cyan" en su Signal 'color()'.
 *
 * NOTA CLAVE: La palabra 'highlight' en el string de mapeo NO hace referencia al nombre de la
 * clase 'HighlightDirective', sino al nombre del INPUT PÚBLICO (alias) que esa directiva ofrece.
 * =========================================================================================
 */

@Directive({
  selector: "[decorate]",
  hostDirectives: [
    {
      directive: HighlightDirective,
      inputs : ['highlight: decorate'], // connect, color, input in the  DecorateDirective with highlight, input in the HighlightDirective
    },
    UnderlineDirective
  ]

})
export class DecorateDirective {
  // Actúa puramente como un orquestador declarativo de composición arquitectónica.
}
