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

  readonly myLinkActive = inject(RouterLinkActive)

  // =========================================================================================
  // 3. INYECCIÓN OPCIONAL TOLERANTE A FALLOS
  // =========================================================================================
  // Aquí ocurre la magia. Le pedimos a Angular el valor de nuestra llave única.
  // Con '{optional: true}', le decimos: "Si algún componente padre configuró una clase custom,
  // dámela. Si nadie configuró nada, no rompas la app, devuélveme null".
  // =========================================================================================
  readonly className = inject(MY_LINK_ACTIVE_CLASS, {optional: true})

  constructor() {
    // =========================================================================================
    // 4. ESTRATEGIA DE CONTINGENCIA (Fallback Pattern)
    // =========================================================================================
    // Si 'this.className' existe (porque se usó el proveedor), aplicamos esa clase (ej: 'chosen').
    // Si no existe (es null), aplicamos la clase por defecto de toda la vida: 'selected'.
    // Ventaja: La directiva es 100% autónoma por defecto, pero infinitamente personalizable.
    // =========================================================================================
    this.myLinkActive.routerLinkActive = this.className || 'selected'
  }
}

