import { Directive, inject } from "@angular/core";
import { Expander } from './expander';
import { ExpanderComponent } from "./expander.component";

/**
 * =========================================================================================
 * 🔌 PATRÓN: DISPARADOR SEMÁNTICO POR SELECTOR COMBINADO (Composite Attribute Interception)
 * =========================================================================================
 * Esta directiva actúa como un mutador de comportamiento bajo demanda. Permite que toda la barra
 * del encabezado se vuelva interactiva sin obligar al desarrollador a escribir funciones click en el HTML.
 *
 * 📐 EL SUPERPODER DEL SELECTOR COMPUESTO '[expander-header][toggle]':
 *    No se aplica a cualquier elemento. Exige estrictamente que el tag posea AMBOS atributos:
 *    - 'expander-header': El marcador que envía el elemento al slot del título.
 *    - 'toggle': El disparador condicional que activa esta directiva en particular.
 *
 *    * BENEFICIO: Si un acordeón en la app solo lleva 'expander-header' (como el Acordeón 2),
 *      esta directiva se ignora por completo (cursor normal, sin click). Si lleva ambos (como el Acordeón 1),
 *      se inyecta la interactividad instantáneamente.
 *
 * 🛡️ INYECCIÓN CONTEXTUAL COMPARTIDA VÍA SINGLETON LOCAL:
 *    Al igual que el botón inteligente, esta directiva ejecuta 'inject(ExpanderComponent, {optional: true})'.
 *    Asciende por el DOM y se amarra al mismo y único acordeón contenedor. Al hacer click, ejecuta
 *    '.toggle()', compartiendo el control del estado reactivo de forma 100% coordinada en memoria.
 * =========================================================================================
 */
@Directive({
  selector: '[expander-header][toggle]',
  host: {
    '[style.cursor]': '"pointer"',
    '(click)': 'onClick()'
  }

})
export class ExpanderHeaderToggleDirective {

  readonly expander = inject(ExpanderComponent, {optional: true})

  onClick() {
    this.expander?.toggle();
  }
}
