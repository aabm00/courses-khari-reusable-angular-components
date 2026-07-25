import { Directive, inject, Renderer2 } from '@angular/core';
import { capitalizeWords } from '../utils/string.utils';

/**
 * =========================================================================================
 * PATRÓN DE DISEÑO: INTERCEPCIÓN SEMÁNTICA MEDIANTE SELECTORES COMPLEJOS Y RENDERED EN SSR
 * =========================================================================================
 *
 * 1. PODER DE LOS SELECTORES COMPLEJOS EN EL SELECTOR DE LA DIRECTIVA:
 *    El selector 'input[type="text"][capitals]' no es un simple atributo. Utiliza una regla
 *    de coincidencia estricta basada en CSS que exige tres condiciones obligatorias:
 *      - El elemento debe ser una etiqueta nativa <input>
 *      - Debe tener explícitamente el atributo type="text"
 *      - Debe contener el atributo marcador 'capitals'
 *
 *    ¿Qué ganamos con esto? (Seguridad y Acoplamiento Cero):
 *    Evita que la directiva se aplique accidentalmente en elementos donde no tiene sentido,
 *    como un <input type="date">, un <input type="number">, o incluso una etiqueta <label capitals>
 *    (como ocurre en la fila de 'Last Name' de tu HTML). Angular ignorará silenciosamente
 *    esos elementos inválidos sin lanzar errores en tiempo de ejecución.
 *
 * 2. JUSTIFICACIÓN ARQUITECTÓNICA: ¿POR QUÉ RENDERER2 EN LUGAR DE 'input.value = ...'?
 *    Mutar el DOM directamente usando código imperativo de navegador (ej: 'input.value = x')
 *    es un antipatrón en arquitecturas modernas por dos motivos críticos:
 *
 *    A) Rompe el Server-Side Rendering (SSR) / Pre-rendering:
 *       Cuando ejecutas Angular en el servidor (Node.js) para mejorar el SEO, objetos globales
 *       como 'window', 'document' o las propiedades directas de los elementos HTML NO existen.
 *       Intentar modificarlos directamente provocaría que la aplicación crasheara en el servidor.
 *       'Renderer2' actúa como un intermediario (una capa de abstracción). Si la app se ejecuta en
 *       el servidor, 'Renderer2' simula el cambio de forma segura; si se ejecuta en el navegador,
 *       aplica el cambio en el DOM real.
 *
 *    B) Prevención Avanzada contra Ataques XSS (Seguridad):
 *       Aunque modificar un 'value' de un input es generalmente seguro, usar la API de 'Renderer2'
 *       pasa automáticamente el contenido por los motores de sanitización nativos de Angular,
 *       protegiendo la aplicación ante posibles inyecciones de código malicioso.
 * =========================================================================================
 */

@Directive({
  selector: 'input[type="text"][capitals]',
  host: {
    '[style.border]': '"1px solid var(--color-secondary)"',
    '(blur)': 'capitalize($event)' // Cuando pierde el foco
  }
})
export class Capitalize {

  readonly renderer = inject(Renderer2);

  capitalize(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    // input.value = input.value.toUpperCase(); // This is a simple way to capitalize the entire input value
    const value = input.value;
    const capitalizedValue = capitalizeWords(value);
    // input.value = capitalizedValue;
    this.renderer.setProperty(input, 'value', capitalizedValue);

  }
}


