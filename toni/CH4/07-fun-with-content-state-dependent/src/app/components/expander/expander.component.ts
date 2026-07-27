import { Component, computed, contentChild, signal } from '@angular/core';
import { ExpanderToggleComponent } from './expander-toggle/expander-toggle.component';

@Component({
  selector: 'app-expander',
  imports: [],

  templateUrl: './expander.component.html',
  styleUrl: './expander.component.scss',
  host: {
    '[class.collapsed]': 'isCollapsed()',
    '[class.expanded]': 'isExpanded()'
  }
})
export class ExpanderComponent {

  readonly #isExpanded = signal(false);

  readonly isExpanded = this.#isExpanded.asReadonly();
  readonly isCollapsed = computed(() => !this.isExpanded());

  /**
   * =========================================================================================
   * 🔍 CONSULTA REACTIVA UNIVERSAL (Universal Content Query Coverage)
   * =========================================================================================
   * - 'contentChild(ExpanderToggleComponent)': Busca en el contenido proyectado la presencia
   *   de la clase 'ExpanderToggleComponent' (la cual se activa mediante el atributo '[expander-toggle]').
   *
   * 🛠️ CÓMO ESTA ÚNICA LÍNEA CUBRE TODOS LOS ESCENARIOS DIVERGENTES EN 'app.html':
   *
   *   - CASO ACORDEÓN 1 (Icono Rotativo): El padre inyecta un botón con un icono. Como lleva el
   *     atributo 'expander-toggle', Angular localiza la instancia del componente. 'hasCustomToggle()'
   *     se vuelve 'true', se oculta el botón por defecto (+/-) y se proyecta este botón visual.
   *
   *   - CASO ACORDEÓN 3 (Textos Dinámicos Abierto/Cerrado): El padre inyecta un botón con los sub-slots
   *     '[expander-open]' y '[expander-closed]'. El Query Signal lo detecta EXACTAMENTE IGUAL que el caso 1,
   *     porque la raíz del tag sigue siendo la misma clase 'ExpanderToggleComponent'. El acordeón le cede
   *     el control de la ranura, permitiendo que el botón internamente orqueste la alternancia de textos.
   *
   *   - CASO ACORDEÓN 2 (Comportamiento Fallback / Sin Botón): El padre no escribe el atributo.
   *     El Query Signal se resuelve como 'null'. 'hasCustomToggle()' computa a 'false' y la plantilla
   *     HTML despliega limpiamente el botón genérico integrado de fábrica (+/-).
   *
   * * LECCIÓN SENIOR: Al buscar la clase lógica del componente en lugar de strings o tags HTML rígidos,
   *   una sola consulta en TypeScript da soporte polimórfico y automatizado al 100% de las variaciones
   *   de botones personalizados que el equipo de desarrollo decida maquetar en el futuro.
   * =========================================================================================
   */
  readonly expanderToggleComponent = contentChild( ExpanderToggleComponent )
  readonly hasCustomToggle = computed(() => !! this.expanderToggleComponent())


  toggle() {
    this.#isExpanded.update(v => !v);
  }
}
