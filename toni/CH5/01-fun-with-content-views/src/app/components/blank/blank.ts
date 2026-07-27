import { Component, ViewEncapsulation } from '@angular/core';

/**
 * =========================================================================================
 * 🔬 MASTERCLASS ARQUITECTÓNICA: MODOS DE ENCAPSULACIÓN DE VISTA (ViewEncapsulation)
 * =========================================================================================
 * Angular procesa el aislamiento visual de los componentes a través de tres estrategias
 * críticas en su decorador. Entenderlas define la predictibilidad de tus sistemas de diseño:
 *
 * 1. ViewEncapsulation.Emulated (Por Defecto de Fábrica):
 *    Angular aísla por completo los estilos de 'blank.scss'. ¿Cómo? Modifica los selectores
 *    en tiempo de compilación e inyecta atributos únicos en el HTML del navegador (ej: convierte
 *    'h3' en 'h3[_ngcontent-app-c51]').
 *    - EFECTO: El color magenta de este archivo SOLO afectará al <h3> interno de este componente.
 *      Ningún otro <h3> de la aplicación se verá contaminado. Máxima seguridad.
 *
 * 2. ViewEncapsulation.None (Peligro de Fuga Global):
 *    Si desomentaras esta propiedad, Angular desactivaría todas las barreras de aislamiento.
 *    El selector 'h3 { color: magenta }' se compilaría en la cabecera de la web de forma cruda.
 *    - EFECTO: ABSOLUTAMENTE TODOS los títulos <h3> de toda tu aplicación web (incluidos los de
 *      páginas ajenas) se volverían de color magenta instantáneamente. Es un antipatrón destructivo
 *      salvo para hojas de estilos de reseteo global.
 *
 * 3. ViewEncapsulation.ShadowDom (Aislamiento Nativo de Hardware):
 *    Fuerza al navegador a encapsular el componente utilizando la API de Shadow DOM oficial de la W3C.
 *    Crea un árbol web cerrado e impenetrable.
 *    - EFECTO: Consigue un aislamiento perfecto, pero introduce un problema: los estilos globales
 *      de la aplicación (como las utilidades de Tailwind CSS o fuentes corporativas de la app)
 *      NO PUEDEN penetrar en este componente a menos que los importes explícitamente dentro de su
 *      propio 'blank.scss'.
 * =========================================================================================
 */
@Component({
  selector: 'app-blank',
  imports: [],
  templateUrl: './blank.html',
  styleUrl: './blank.scss',
  // encapsulation: ViewEncapsulation.None // Makes the styling in this component global. Be careful about it.
})
export class Blank {
  // Componente atómico diseñado para la experimentación y auditoría de herencia de estilos
}



