import { Directive, inject, InjectionToken, Provider } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

// =========================================================================================
// 1. ¿QUÉ ES ESTE TOKEN Y POR QUÉ ES NECESARIO? (Garantía de Unicidad)
// =========================================================================================
// En aplicaciones grandes, no puedes usar strings comunes como 'clase-activa' para configurar
// cosas, porque si otra librería usa el mismo string, causarías un conflicto de nombres.
// 'InjectionToken' crea una "llave" u objeto físico en memoria que Angular usa para identificar
// específicamente ESTA configuración de estilo, asegurando que nadie la pise accidentalmente.
//
// NOTA SENIOR SOBRE EL STRING EN LOS PARÉNTESIS ('MY_LINK_ACTIVE_CLASS'):
// Este texto entre comillas NO es el token en sí mismo. Es una simple etiqueta de texto
// descriptiva exigida por la API de Angular exclusivamente para ayudarte a ti, el desarrollador.
// Si la inyección falla, Angular usará ese string en la consola para mostrarte un error legible
// (ej: "No provider for MY_LINK_ACTIVE_CLASS"). Para el motor de Angular, el string es invisible;
// lo que realmente importa es la referencia única del objeto en memoria.
// =========================================================================================
export const MY_LINK_ACTIVE_CLASS = new InjectionToken<string>('MY_LINK_ACTIVE_CLASS')

// =========================================================================================
// 2. FUNCIÓN DE UTILIDAD (Abstracción para mejorar la DX / Experiencia del Desarrollador)
// =========================================================================================
// En lugar de obligar al desarrollador a escribir objetos complejos en su componente, creamos
// esta función "fábrica". Simplifica la sintaxis externa: el usuario solo tiene que invocar
// provideMyLinkActiveClass('chosen') y nosotros nos encargamos del trabajo sucio de Angular.
// =========================================================================================
export function provideMyLinkActiveClass(className: string): Provider {
  return {
    provide: MY_LINK_ACTIVE_CLASS,
    useValue: className
  }
}

@Directive({
  selector: '[myLink]',
  hostDirectives: [
    {
      directive: RouterLink,
      inputs: [ 'routerLink: myLink' ],
    },
    RouterLinkActive
  ]
})
export class MyLink {

  /**
   * =========================================================================================
   * ¿POR QUÉ ESTE INJECT NO CREA UNA INSTANCIA NUEVA? (El Patrón Simbionte)
   * =========================================================================================
   * Al haber declarado 'RouterLinkActive' dentro de la matriz 'hostDirectives', Angular fusiona
   * ambas directivas en el mismo elemento HTML.
   * Por lo tanto, al ejecutar 'inject(RouterLinkActive)', Angular NO crea un objeto huérfano;
   * lo que hace es buscar en el mismo elemento la directiva anfitriona y entregarte el control
   * total de su instancia viva de TypeScript.
   * =========================================================================================
   */
  readonly myLinkActive = inject(RouterLinkActive)

  /**
   * =========================================================================================
   * ¿CÓMO VIAJA EL DATO SIN USAR EL HTML? (El Mecanismo de la Cascada de Inyección)
   * =========================================================================================
   * 1. El componente raíz ('app.ts') registra en su inyector: "Para la llave MY_LINK_ACTIVE_CLASS,
   *    el valor es 'chosen'".
   * 2. Cuando esta directiva se despierta, ejecuta esta línea. El comando 'inject()' detiene el
   *    renderizado un milisegundo y empieza a mirar hacia arriba en el árbol de componentes (padres).
   * 3. Al llegar a 'App', encuentra la coincidencia de la llave y Angular extrae el valor ('chosen')
   *    asignándolo directamente a esta variable 'className'.
   *
   * Si la directiva se usara en otra sección de la app donde nadie configuró el proveedor,
   * '{optional: true}' evita que el sistema explote y nos devuelve un pacífico 'null'.
   * =========================================================================================
   */
  readonly className = inject(MY_LINK_ACTIVE_CLASS, {optional: true})

  constructor() {

    /**
     * =========================================================================================
     * EXPLICACIÓN DEL TRUCO FINAL (Hackeando los Inputs por código TypeScript)
     * =========================================================================================
     * La directiva nativa 'RouterLinkActive' expone una propiedad interna en su clase llamada
     * exactamente 'routerLinkActive' (que mapea al input que antes escribíamos en el HTML).
     *
     * Como en el paso anterior atrapamos su instancia viva ('this.myLinkActive'), ahora podemos
     * escribir directamente sobre sus propiedades usando código TypeScript puro.
     *
     * FLUJO LOGÍSTICO:
     * - Si 'this.className' recibió el agua de la cascada (ej: 'chosen'), se la inyectamos a la fuerza.
     * - Si vino 'null' (porque nadie configuró nada arriba), el operador '||' activa la contingencia
     *   y le clava el string por defecto 'selected'.
     *
     * Resultado: Hemos configurado el estilo activo de toda una suite de enlaces de forma 100%
     * programática sin escribir una sola propiedad molesta en las etiquetas del HTML.
     * =========================================================================================
     */
    this.myLinkActive.routerLinkActive = this.className || 'selected'
  }
}
