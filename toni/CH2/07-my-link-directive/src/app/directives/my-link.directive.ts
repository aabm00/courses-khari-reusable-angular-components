import { Directive, inject } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

/**
 * =========================================================================================
 * PATRÓN ARQUITECTÓNICO: ENCAPSULACIÓN DE ENRUTADO (Custom Router Link Facade)
 * =========================================================================================
 * OBJETIVO: Eliminar el "boilerplate" (código repetitivo) en los menús de navegación,
 * unificando la directiva de redirección y la de clase activa en un solo selector de alto nivel.
 *
 * ¿CÓMO SE ELIMINA 'routerLinkActive' DEL HTML?
 * 1. Al incluir 'RouterLinkActive' en 'hostDirectives', Angular la aplica automáticamente
 *    en el DOM detrás de escena.
 * 2. Usamos 'inject(RouterLinkActive)' para capturar de forma segura la instancia de esa
 *    directiva oculta que se acaba de crear en el mismo elemento.
 * 3. En el constructor, configuramos su propiedad de forma imperativa. Esto sustituye
 *    por completo la necesidad de escribir 'routerLinkActive="selected"' en el HTML.
 * =========================================================================================
 */
@Directive({
  selector: '[myLink]',
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [ 'routerLink: myLink' ], // Mapea el valor de [myLink] hacia el [routerLink] interno
    },
    RouterLinkActive // Se inyecta silenciosamente en el elemento host
  ]
})
export class MyLink {

  // Captura la directiva hermana declarada en el hostDirectives
  readonly myLinkActive = inject(RouterLinkActive);

  constructor() {
    // ESTABLECIMIENTO DE COMPORTAMIENTO POR DEFECTO:
    // Aplica la clase CSS '.selected' (definida en tu app.scss) cuando la ruta actual coincida.
    this.myLinkActive.routerLinkActive = 'selected';
  }
}

