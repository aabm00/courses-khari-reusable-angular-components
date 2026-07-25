import { Component, computed, input, signal } from '@angular/core';
/**
 * =========================================================================================
 * 📑 MANUAL GLOBAL DE ARQUITECTURA: CRONOLOGÍA SINCRO-MECÁNICA DEL GRID REFLOW
 * =========================================================================================
 * En Angular 22, las animaciones se han simplificado eliminando el antiguo paquete de macros.
 * Este componente coordina de forma matemática la estructura CSS Grid del Host con la
 * inserción y destrucción de nodos condicionales (@if) mediante la nueva API nativa de plantillas.
 *
 * ⚙️ PASO A PASO DEL FLUJO MECÁNICO EN TIEMPO DE EJECUCIÓN:
 *
 * 🛑 FASE 1: PROCESO DE COLLAPSE (Cierre del Acordeón)
 *   1. El usuario hace click en el botón de alternancia. El Signal privado '#isExpanded' muta a 'false'.
 *   2. [REFLOW DEL GRID]: El Host Binding reacciona al Signal 'isCollapsed()' e inyecta inmediatamente
 *      la clase '.collapsed' en la etiqueta raíz (<app-expander>).
 *   3. [TRANSICIÓN]: El CSS lee '.collapsed' y cambia 'grid-template-rows' de 1fr a 0fr. La estructura
 *      física exterior de la caja empieza a encogerse progresivamente durante 300ms.
 *   4. [INTERCEPCIÓN DOM]: Al mismo tiempo, la directiva de control de flujo '@if(isExpanded())' evalúa
 *      a falso. Normalmente, Angular borraría el HTML al instante, lo que rompería la transición visual.
 *   5. [RETENCIÓN NATIVA]: Aquí actúa 'animate.leave="leaves"'. Al ser una propiedad nativa de Angular 22,
 *      el framework intercepta la destrucción del nodo, frena su eliminación física del DOM y le aplica
 *      la clase CSS 'leaves' de forma automática.
 *   6. [ANIMACIÓN DE SALIDA]: La clase '.leaves' ejecuta los keyframes '@keyframes delay' durante 300ms.
 *      Esto desvanece la opacidad de 1 a 0 y colapsa los paddings de forma idéntica al encogimiento del Grid.
 *   7. [PURGA DE MEMORIA]: Angular 22 mide de forma interna el tiempo de la animación CSS. Al cumplirse los
 *      300ms (cuando la opacidad es 0), Angular remueve de forma segura el nodo físico del árbol DOM.
 *
 * 🟢 FASE 2: PROCESO DE EXPAND (Apertura del Acordeón)
 *   1. El Signal privado cambia a 'true'. El Host Binding inyecta la clase '.expanded'. El CSS inicia
 *      la apertura del contenedor Grid hacia 1fr durando 300ms.
 *   2. Angular reinserta de forma fulminANTE el nodo HTML en el DOM porque el '@if' es verídico.
 *   3. El atributo nativo 'animate.enter="enters"' intercepta el nacimiento del nodo e inyecta la clase
 *      '.enters' instantáneamente.
 *   4. Se ejecutan los keyframes de forma invertida ('reverse') durante 300ms, haciendo que el texto
 *      aparezca suavemente (opacity 0 -> 1) a medida que la persiana del Grid se abre.
 *
 * 📐 REGLA ESTRICTA DE COINCIDENCIA CRONOMÉTRICA (The 300ms Match):
 * La propiedad 'transition' del Grid en el ':host' de SCSS dura 300ms. La propiedad 'animation' de las
 * clases '.leaves'/'.enters' dura 300ms. Estos tiempos DEBEN ser idénticos. Si el Grid se cerrara en
 * 200ms y la animación durase 300ms, el texto interior sería aplastado e interceptado de forma abrupta,
 * causando un parpadeo o salto de layout ('layout jump').
 * =========================================================================================
 */
@Component({
  selector: 'app-expander',
  imports: [],
  templateUrl: './expander.html',
  styleUrl: './expander.scss',
  /**
   * =========================================================================================
   * COORDINACIÓN DE ANIMACIÓN VÍA HOST BINDINGS (CSS Grid Trigger)
   * =========================================================================================
   * En lugar de manipular el DOM de forma imperativa con JavaScript, delegamos la animación
   * al motor CSS del navegador mediante la inyección declarativa de clases en el elemento raíz:
   *
   * - '[class.collapsed]': Se activa cuando 'isCollapsed()' es true, forzando al CSS a mutar
   *   la fila del grid a '0fr'.
   * - '[class.expanded]': Se activa cuando 'isExpanded()' es true, expandiendo la fila a '1fr'.
   *
   * Al mapear los Signals directamente al Host, Angular reacciona instantáneamente a los cambios
   * de estado sin añadir sobrecarga de repintado (Reflow) innecesaria en el hilo de TypeScript.
   * =========================================================================================
   */
  host: {
    '[class.collapsed]': 'isCollapsed()', // Triggers the 0fr CSS grid state when the accordion is closed
    '[class.expanded]': 'isExpanded()'    // Triggers the 1fr CSS grid state when the accordion is open
  }
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
