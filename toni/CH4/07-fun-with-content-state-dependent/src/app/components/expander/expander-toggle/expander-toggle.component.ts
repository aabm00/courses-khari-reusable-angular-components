import { Component, computed, inject } from "@angular/core";
import { ExpanderComponent } from "../expander.component";

// It is a transparent component because the selector matches with the slot
// selector in  expander.html <ng-content select="[expander-toggle]" />

/**
 * =========================================================================================
 * 🎭 PATRÓN: COMPONENTE INTERMEDIARIO DE ATRIBUTO (The Chameleon / Attribute Component)
 * =========================================================================================
 * ¡ATENCIÓN DESARROLLADOR!: Este archivo es técnicamente un COMPONENTE (@Component), pero
 * se comporta visualmente como una DIRECTIVA en el HTML debido a su selector híbrido.
 *
 * ❓ ¿Por qué usamos 'selector: "[expander-toggle]"' (con corchetes) en un Componente?:
 * Tradicionalmente, los componentes usan selectores de etiqueta (ej: 'app-icon'). Sin embargo,
 * Angular permite usar selectores de atributo en componentes. Esto crea un híbrido que soluciona
 * un límite del framework:
 *
 * 1. LAS DIRECTIVAS NO TIENEN TEMPLATE: Si esto fuera una directiva pura, solo podría escuchar
 *    el click, pero NO podría tener un archivo HTML interno para hacer proyección condicional.
 *
 * 2. LOS COMPONENTES DE ETIQUETA ENSUCIAN EL DOM: Si usáramos un selector normal como 'app-toggle',
 *    obligaríamos al desarrollador a escribir una estructura fea y rígida en su HTML:
 *    <app-toggle><button> Texto </button></app-toggle> -> Rompiendo los estilos CSS nativos.
 *
 * 🌟 EL BENEFICIO REAL (API Invisible "Under the Hood"):
 * Al fusionar ambos mundos, el consumidor simplemente escribe un botón nativo ordinario con un
 * atributo: <button expander-toggle>. Para el programador es intuitivo y limpio, pero para Angular,
 * ese botón se transforma secretamente en un componente inteligente que inyecta su propia plantilla
 * condicional por dentro, filtrando las etiquetas '[expander-open]' y '[expander-closed]'.
 * =========================================================================================
 */

@Component({
  selector: '[expander-toggle]',
  templateUrl: './expander-toggle.component.html',
  styleUrl: './expander-toggle.component.scss',
  host: {
    '(click)': 'onClick()'
  }
})
export class ExpanderToggleComponent {

  readonly expanderComponent = inject(ExpanderComponent, { optional: true})

  /**
   * =========================================================================================
   * 🧬 DERIVACIÓN UNIDIRECCIONAL DE ESTADOS (Encapsulated State Pulling)
   * =========================================================================================
   * Creamos señales computadas locales que "escuchan" de forma pasiva y unidireccional la señal
   * 'isExpanded' expuesta por el contenedor padre inyectado.
   *
   * ¿Por qué es una arquitectura excelente para aplicaciones modernas?:
   * Respeta escrupulosamente el principio de responsabilidad única. El botón no almacena el
   * estado del acordeón (el acordeón sigue siendo el único dueño de la verdad), pero al derivarlo
   * mediante 'computed()', garantizamos que la plantilla de este botón reaccione quirúrgicamente
   * a los clicks con el mínimo coste de procesamiento y acoplamiento estructural cero.
   * =========================================================================================
   */
  readonly isExpanded = computed(() => this.expanderComponent?.isExpanded() === true)
  readonly isCollapsed = computed(() => this.expanderComponent?.isExpanded() === false)

  onClick() {
    // console.log('Received the click event')

    this.expanderComponent?.toggle()

  }

}

