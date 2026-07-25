import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICONS, KnownIcon, UNKNOWN_ICON } from './icons';

/**
 * =========================================================================================
 * 🧠 ARQUITECTURA DE ALTO RENDIMIENTO GRÁFICO: SINCRO-REACTIVIDAD Y COMPILACIÓN DEFENSIVA
 * =========================================================================================
 *
 * 1. ¿TIENE SENTIDO 'ONPUSH' EN LA ERA ZONELESS DE ANGULAR 22?
 *    Si tu aplicación está configurada como 'Zoneless' nativa pura (sin Zone.js), la reactividad
 *    por Signals es quirúrgica por defecto y 'OnPush' ya no altera el comportamiento del framework.
 *    Sin embargo, dejarlo explícito es una práctica obligatoria de arquitectura defensiva:
 *
 *    - El Peligro del Contenido Proyectado: Cuando este icono se proyecta dentro de un contenedor
 *      (como '<app-expander>'), vive físicamente en el HTML del padre pero se renderiza en el hijo.
 *      Si la app usa Zone.js y NO configuras 'OnPush' aquí, cualquier cambio menor en el estado del
 *      padre obligará a Angular a re-evaluar el icono repetidamente. 'OnPush' actúa como un escudo.
 *    - Compatibilidad Corporativa: Garantiza un rendimiento óptimo con un consumo de CPU cercano a cero
 *      tanto si el equipo que consume tu componente trabaja en Angular 22 Zoneless puro como si opera
 *      en una aplicación híbrida legada.
 *
 * 2. SEGURIDAD EN TIEMPO DE COMPILACIÓN VÍA 'INPUT.REQUIRED':
 *    Al declarar 'input.required<KnownIcon>()', obligamos al desarrollador a pasar obligatoriamente
 *    un nombre de icono válido en el HTML (ej: <app-icon name="projection" />). Si intenta pasar un
 *    string genérico o vacío, Angular romperá la compilación inmediatamente. Esto previene que suban
 *    iconos rotos a producción y elimina la necesidad de escribir validaciones manuales en TypeScript.
 *
 * 3. MEMOIZACIÓN EFICIENTE CON SEÑALES COMPUTADAS ('COMPUTED'):
 *    La propiedad 'pathData' utiliza 'computed()' para crear una señal derivada. Esto significa que
 *    el diccionario 'ICONS' solo se consulta una única vez cuando el icono se renderiza. Si la pantalla
 *    sufre re-renders por otros motivos, Angular jamás vuelve a ejecutar esta línea; reutiliza el valor
 *    en cache. Además, implementa un "Fallback seguro" usando el operador (??): si el desarrollador
 *    engaña al tipado y el icono no existe, muestra un icono de interrogación ('UNKNOWN_ICON') de forma
 *    silenciosa en lugar de dejar el SVG roto o vacío en el DOM.
 * =========================================================================================
 */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<KnownIcon>();

  protected readonly pathData = computed(() => ICONS[this.name()] ?? UNKNOWN_ICON);
}
