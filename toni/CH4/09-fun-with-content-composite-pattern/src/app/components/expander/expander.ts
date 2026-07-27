import { ExpanderComponent } from "./expander.component";
import { ExpanderToggleComponent } from "./expander-toggle/expander-toggle.component";
import { ExpanderHeaderToggleDirective } from "./expander-header-toggle.directive";

/**
 * =========================================================================================
 * 📦 CONSTANTE DE COMPOSICIÓN AMPLIVÍA (Extended Composite Export Array)
 * =========================================================================================
 * Añadimos 'ExpanderHeaderToggleDirective' al paquete de co-locación.
 *
 * BENEFICIO: Al estar empaquetado dentro de la constante global 'Expander', el desarrollador
 * de la aplicación obtiene acceso inmediato a la funcionalidad del encabezado interactivo sin
 * tener que alterar sus metadatos de importación en 'app.component.ts'. El ecosistema crece
 * internamente manteniendo la API de consumo externa intacta y ultra-limpia.
 * =========================================================================================
 */
export const Expander = [
  ExpanderComponent,
  ExpanderToggleComponent,
  ExpanderHeaderToggleDirective
]
