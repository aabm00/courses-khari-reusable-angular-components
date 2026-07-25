import { Component } from "@angular/core";

/**
 * =========================================================================================
 * MASTERCLASS DE ARQUITECTURA: SELECTORES OMNIPRESENTES Y MITOLOGÍA INTERNA DE ANGULAR
 * =========================================================================================
 *
 * 1. ¿QUÉ ES REALMENTE UN COMPONENTE? (La verdad bajo el capó):
 *    Para el motor de renderizado de Angular, UN COMPONENTE ES UNA DIRECTIVA. No son cosas
 *    distintas. Un componente hereda exactamente toda la base de código de las directivas,
 *    pero añade un único superpoder extra: tiene una plantilla visual (HTML) y encapsulación
 *    de estilos (CSS). Por eso, todo lo que haces en una directiva (host bindings, listeners,
 *    injects) se hace igual en un componente.
 *
 * 2. SOBREESCRITURA NATIVA Y EL PELIGRO DE LA "MAGIA NEGRA" TRANSPARENTE:
 *    Al usar el selector 'button' (el nombre de la etiqueta HTML nativa), estás interceptando
 *    absolutamente TODOS los botones estándar de la aplicación de forma invisible.
 *
 *    - ¿Es una buena práctica?: Rotundamente NO para este caso de uso humorístico o "crazy".
 *      Rompe el principio de menor sorpresa: un desarrollador escribe un <button> normal esperando
 *      un comportamiento del navegador y, de repente, Angular le inyecta textos ("!!...CRAZY !!")
 *      y bordes sin previo aviso en el HTML. Esto destruye la mantenibilidad.
 *
 *    - ¿Se utiliza en el mundo real? SÍ, pero para misiones críticas de infraestructura:
 *      * Normalización de Accesibilidad: Forzar a que todos los <button> nativos tengan ciertos
 *        atributos ARIA por defecto si el desarrollador se olvida de ponerlos.
 *      * Reset Global de Estilos: Componentes de diseño (como Angular Material) que interceptan
 *        etiquetas nativas para aplicarles un look moderno automáticamente sin obligar a escribir
 *        clases CSS en cada etiqueta.
 *
 * 3. HASTA DÓNDE SE PUEDE LLEVAR EL PODER DE LOS SELECTORES EN ANGULAR:
 *    Los selectores de Angular se basan en el motor de selectores de CSS, lo que te da una
 *    flexibilidad total. Puedes aplicar componentes y directivas apuntando a:
 *      - Etiquetas nativas: 'button', 'input', 'div' (como en este ejemplo).
 *      - Atributos: '[my-attribute]', '[capitals]'.
 *      - Clases CSS: '.my-custom-class' (¡Sí! Puedes hacer que un componente se active cuando
 *        un elemento tenga una clase específica).
 *      - Pseudo-clases / Combinaciones complejas: 'input[type="text"]:not([disabled])'. Puedes
 *        crear una directiva que solo se active en inputs de texto que NO estén deshabilitados.
 *
 *    No existen más elementos en Angular más allá de Componentes y Directivas para aplicar esto,
 *    pero el hecho de que puedas usar selectores CSS completos transforma a Angular en un mutador
 *    del DOM infinitamente más potente que otros frameworks tradicionales.
 * =========================================================================================
 */

@Component({
  selector: 'button',
  host: {
    '[style.border]': '"1px solid var(--color-secondary)"'
  },
  template: `
    !! <ng-content /> CRAZY !!
  `
})
export class CrazyButton {}


