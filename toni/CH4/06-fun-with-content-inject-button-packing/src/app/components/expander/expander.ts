import { ExpanderComponent } from "./expander.component";
import { ExpanderToggle } from "./expander-toggle/expander-toggle.directive";

/**
 * =========================================================================================
 * 📦 PATRÓN: CONSTANTE DE CO-LOCACIÓN DE COMPONENTES COMPUESTOS (Composite Export Array)
 * =========================================================================================
 * En Angular con componentes Standalone, si un desarrollador quiere usar el expander, tendría
 * que importar manualmente dos clases en su componente: imports: [ExpanderComponent, ExpanderToggle].
 * Si se olvida de una, el acordeón se romperá o los botones no funcionarán.
 *
 * ¿Cómo soluciona esto esta constante?:
 * Agrupamos el componente y su directiva puente en un único array exportable.
 * Ahora, en 'app.component.ts', el desarrollador solo tiene que escribir
 * import { Expander } from './components/expander/expander';
 * y Angular importará internamente todo el ecosistema de herramientas del acordeón en una sola línea.
 * Esto reduce la fricción, mejora la DX (Experiencia del Desarrollador) y evita errores de omisión.
 * =========================================================================================
 */
export const Expander = [
  ExpanderComponent,
  ExpanderToggle
]
