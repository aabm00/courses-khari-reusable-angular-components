import { Component, computed, input, signal } from '@angular/core';

/**
 * =========================================================================================
 * 📐 REGLA DE ORO ARQUITECTÓNICA: CUÁNDO USAR PROYECCIÓN DE CONTENIDO VS INPUTS
 * =========================================================================================
 * La proyección de contenido con <ng-content /> es una de las herramientas más potentes del
 * diseño de software, pero debe usarse con criterio de producción:
 *
 * ✅ CUÁNDO UTILIZARLO (Abierto a la Extensión):
 *   - Componentes "Contenedores" o Wrappers de UI: Tarjetas, Modales, Acordeones, Sidebars, Tabs.
 *   - Cuando la UI interior varía constantemente (ej: un acordeón a veces lleva una lista,
 *     otra vez lleva un formulario y otra vez una imagen).
 *   - Para cumplir el Principio Abierto/Cerrado (SOLID): el componente está cerrado a modificaciones
 *     en su código fuente, pero abierto a extender su comportamiento visual desde fuera.
 *
 * ❌ CUÁNDO NO UTILIZARLO (Mejor usar Inputs/Signals clásicos):
 *   - Componentes de Datos o "Presentacionales" puros: Un avatar de usuario, un gráfico de barras,
 *     un tag de precio, etc. Estos componentes controlan estrictamente su diseño y solo necesitan
 *     que les inyectes la información cruda (un string de URL, un array de números).
 *   - Si necesitas controlar, validar o transformar los datos que entran. Con <ng-content />,
 *     el componente hijo NO puede inspeccionar de forma sencilla el HTML que el padre le inyecta;
 *     simplemente lo renderiza a ciegas.
 * =========================================================================================
 */

@Component({
  selector: 'app-expander',
  imports: [],
  templateUrl: './expander.html',
  styleUrl: './expander.scss',
  host: {
    '[class.collapsed]': 'isCollapsed()',
    '[class.expanded]': 'isExpanded()'
  }
})
export class ExpanderComponent {
  readonly #isExpanded = signal(false);

  readonly isExpanded = this.#isExpanded.asReadonly();
  readonly isCollapsed = computed(() => !this.isExpanded());

  toggle() {
    this.#isExpanded.update(v => !v);
  }

  readonly header = input('')
}
