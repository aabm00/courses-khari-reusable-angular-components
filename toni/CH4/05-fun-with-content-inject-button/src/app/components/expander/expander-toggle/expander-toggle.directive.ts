import { Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander";

/**
 * =========================================================================================
 * 🔌 PATRÓN: DIRECTIVA DE ACOPLAMIENTO CONTEXTUAL JERÁRQUICO (Bridge Pattern)
 * =========================================================================================
 * Esta directiva es un "cable inteligente". No tiene diseño visual propio; su única misión
 * en la vida es capturar los clicks del consumidor y redirigirlos al acordeón que lo envuelve.
 *
 * ¿CÓMO SE CONECTA SI NO ESTÁ APLICADA DIRECTAMENTE EN EL COMPONENTE EXPANDER?
 * Como bien has analizado, esta directiva NO se escribe sobre la etiqueta del componente (<app-expander>).
 * Se aplica en un elemento primitivo separado (<button expander-toggle>) que el padre proyecta.
 *
 * Al ejecutarse, 'inject(ExpanderComponent)' activa la mecánica del Inyector Jerárquico de Angular:
 *   1. Mira el elemento físico donde está pegada la directiva (el <button> en app.html). ¿Es un componente
 *      Expander? No.
 *   2. Sube inmediatamente un peldaño en la jerarquía del árbol HTML de la plantilla hacia su contenedor.
 *   3. Encuentra la etiqueta contenedora raíz <app-expander> y captura esa instancia exacta del componente.
 *
 * * VENTAJA RADICAL: Comunicación limpia sin eventos burbujeando ni @Outputs pesados. La directiva
 *   obtiene una línea directa con la API pública de su componente contenedor superior de forma instantánea,
 *   actuando como el puente de control perfecto.
 * =========================================================================================
 */
@Directive({
  selector: '[expander-toggle]',
  host: {
    // Escucha el click nativo del elemento del DOM donde el desarrollador pegue esta directiva
    '(click)': 'onClick()'
  }
})
export class ExpanderToggle {

  /**
   * =========================================================================================
   * 🔬 ANÁLISIS DE ALTERNATIVAS: ¿POR QUÉ NO USAMOS UN ENFOQUE BASADO EN OUTPUTS?
   * =========================================================================================
   * Una solución tradicional para este problema habría sido configurar un Emisor de Eventos
   * clásico en esta directiva (ej: 'readonly toggleClicked = output<void>()') y dispararlo
   * al hacer click. Sin embargo, ese enfoque introduce graves deficiencias de diseño:
   *
   * 🛑 1. CONTAMINACIÓN DE CABLES EN EL HTML (Boilerplate & Template Variable Hell):
   *    Para conectar el evento del botón con el componente acordeón, estarías obligado a usar
   *    un intermediario manual en la plantilla del padre ('app.html') mediante una variable de
   *    referencia local (#):
   *
   *    <app-expander #miExpander>
   *       <button expander-toggle (toggleClicked)="miExpander.toggle()"> ... </button>
   *    </app-expander>
   *
   * 🛑 2. COMPLEJIDAD Y RIGIDEZ ANTE MÚLTIPLES INSTANCIAS (The Multi-Instance Bug):
   *    Si en una misma pantalla necesitaras renderizar 5 acordeones seguidos, te verías obligado
   *    a inventar 5 nombres de variables completamente diferentes en el HTML para evitar colisiones
   *    (#expander1, #expander2, #expander3, etc.) y cruzar manualmente las funciones en cada tag:
   *    (toggleClicked)="expander1.toggle()", (toggleClicked)="expander2.toggle()", etc.
   *    Esto genera un código masivamente duplicado, propenso a errores de copia y pega, y destructivo
   *    para la mantenibilidad a largo plazo.
   *
   * ✅ LA VENTAJA RADICAL DE 'INJECT()':
   *    Al usar 'inject(ExpanderComponent)', la directiva se conecta al acordeón de forma universal
   *    y transparente en la memoria del navegador. No importa si renderizas 1 o 50 expanders en la
   *    web; el HTML de todos ellos se escribe de manera idéntica y limpia (<button expander-toggle>).
   *    Angular empareja de forma automatizada cada botón proyectado con su contenedor exacto subiendo
   *    por el árbol DOM, erradicando el acoplamiento visual.
   * =========================================================================================
   */
  // Descubre y amarra al padre superior subiendo por la jerarquía del DOM
  readonly expanderComponent = inject(ExpanderComponent)

  onClick() {
    // console.log('Received the click event')

    // Al hacer click, ejecutamos el método público .toggle() del padre inyectado,
    // alterando su señal reactiva interna de forma segura y transparente.
    this.expanderComponent.toggle()

  }

}

