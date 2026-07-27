import { Component, computed, Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander.component";

/**
 * =========================================================================================
 * 🎭 ARQUITECTURA DE COMPONENTES DE ATRIBUTO (Attribute Component & State Pulling)
 * =========================================================================================
 * - 'selector: "[expander-toggle]"': Aunque es un '@Component' con archivo HTML y CSS propios,
 *   se disfraza de directiva en el DOM. Esto permite que el usuario escriba <button expander-toggle>,
 *   manteniendo la semántica CSS limpia del navegador pero dotando al botón de una plantilla interna.
 *
 * - 'inject(ExpanderComponent, { optional: true })': Asciende por la jerarquía de nodos físicos
 *   del DOM hasta amarrar la instancia del acordeón contenedor exacto de forma 100% automatizada.
 *
 * - 'computed(...)': Deriva el estado de apertura de forma pasiva y unidireccional. Al estar en la
 *   era de Angular modernos, estas variables se cachean en memoria; si la pantalla sufre re-renders
 *   por causas externas, estas funciones NO se vuelven a evaluar a menos que el Signal del padre cambie,
 *   garantizando un impacto cero en la CPU.
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

    // Amarra al padre jerárquico protegiendo la app contra crashes con el flag optional
    readonly expanderComponent = inject(ExpanderComponent, {
        optional: true
    });

    // Estado reactivo derivado y optimizado para la plantilla condicional
    readonly isExpanded = computed(() => this.expanderComponent?.isExpanded() === true);
    readonly isCollapsed = computed(() => this.expanderComponent?.isExpanded() === false);


    onClick() {
        // Ejecuta el método mutador del padre de forma segura ante elementos descontextualizados
        this.expanderComponent?.toggle();
    }

}
