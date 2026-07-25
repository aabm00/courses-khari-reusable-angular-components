import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-expander',
  imports: [],
  templateUrl: './expander.html',
  styleUrl: './expander.scss',
})
export class ExpanderComponent {

  /**
   * =========================================================================================
   * PATRÓN: PROTECCIÓN DE ESTADO UNIDIRECCIONAL (Read-Only Signal Pattern)
   * =========================================================================================
   * ¿CÓMO FUNCIONA LA ALMOHADILLA (#)? (Estándar ECMAScript Nativo)
   * La almohadilla (#) activa la privacidad nativa a nivel de lenguaje JavaScript.
   * No es un decorador de Angular ni una regla de TypeScript. Esto significa que:
   *
   * 1. '#isExpanded' e 'isExpanded' son dos variables COMPLETAMENTE DIFERENTES para el motor del navegador.
   * 2. Nadie fuera de esta clase (ni un componente padre, ni un test, ni una directiva) puede mutar
   *    o siquiera ver el Signal '#isExpanded'. Intentarlo lanzará un error fatal en la consola.
   * 3. Exponemos 'isExpanded' (sin almohadilla) usando '.asReadonly()'. Esto crea un clon de "solo lectura".
   *    La plantilla HTML y los componentes externos pueden ESCUCHAR el cambio, pero tienen CERO permisos
   *    para usar '.set()' o '.update()' sobre él.
   *
   * ¿Es un estándar universal?
   * SÍ. Al ser JavaScript nativo, funciona exactamente igual en Vue 3, React, Svelte o cualquier
   * otra tecnología web. Es el estándar de oro actual en ingeniería de software para evitar que
   * agentes externos corrompan el estado interno de tus componentes.
   * =========================================================================================
   */

  readonly #isExpanded = signal(false)
  readonly isExpanded = this.#isExpanded.asReadonly()
  readonly isCollapsed = computed(() => !this.#isExpanded())

  /**
   * Ejecuta el cambio de estado del componente. La mutación queda encapsulada y protegida
   * estrictamente dentro de los métodos del propio componente.
   */

  toggle() {
    this.#isExpanded.update(v => !v)
  }

  /**
   * LIMITACIÓN DE USABILIDAD ACTUAL (Props-Hell / Rigidez):
   * Actualmente el componente recibe la información mediante inputs tradicionales de texto ('input').
   * Esto nos limita radicalmente: solo podemos mostrar texto plano. Si quisiéramos meter un enlace,
   * un icono, una lista o texto en negrita dentro del contenido del expander, el input colapsaría.
   * En los próximos pasos del curso sustituiremos esto por "Content Projection" (Proyección de Contenido).
   */

  readonly header = input('')
  readonly content = input('')

}

