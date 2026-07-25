import { Directive, effect, input } from "@angular/core";

/**
 * =========================================================================================
 * ANÁLISIS ARQUITECTÓNICO: DIRECTIVAS TRANSPARENTES (Ventajas, Riesgos y Código Redundante)
 * =========================================================================================
 *
 * 1. EL CONCEPTO DE "DIRECTIVA TRANSPARENTE" (Omnipresente):
 *    Al usar el selector 'img[alt]', esta directiva se inyecta AUTOMÁTICAMENTE en todas las
 *    imágenes de la aplicación que tengan un texto alternativo por accesibilidad (alt).
 *
 *    - VENTAJA: Limpieza absoluta del HTML de la aplicación. Escalabilidad automática (cualquier
 *      imagen nueva adoptará el comportamiento sin que el desarrollador tenga que escribir nada).
 *    - DESVENTAJA (Mala Práctica de Mantenibilidad): Introduce "Magia Negra". Un desarrollador que
 *      revise el HTML (ej: <img src="..." alt="Sunset">) no verá ningún rastro de Angular y no
 *      entenderá de dónde salen el cursor pointer o los títulos.
 *    - SOLUCIÓN EXPLÍCITA RECOMENDADA: Modificar el selector a 'img[alt][tooltip]' y obligar a
 *      escribir <img alt="..." tooltip>. Es más evidente, aunque introduce más boilerplate en el HTML.
 *
 * 2. RADIOGRAFÍA DE CÓDIGO REDUNDANTE (Simplificación Nativa del Navegador):
 *    Como Senior, debes identificar cuándo estás duplicando el trabajo que el navegador ya hace gratis:
 *
 *    A) El evento '(mouseenter)': Es 100% innecesario para la experiencia de usuario. El navegador
 *       detecta de forma nativa el atributo 'title' y despliega el tooltip flotante automáticamente
 *       sin necesidad de capturar eventos con JavaScript ni saturar la consola con console.log.
 *
 *    B) El constructor y el 'effect()': Solo sirven en este ejercicio con fines educativos para
 *       demostrar la reactividad de los Signals, pero en producción este bloque consume memoria y
 *       ciclos de CPU de manera innecesaria.
 *
 *    C) Alternativa sin Angular: Si el equipo de diseño hubiera colocado directamente el atributo
 *       'title="..."' en las etiquetas <img> del HTML junto al 'alt', esta directiva entera no
 *       habría sido necesaria.
 * =========================================================================================
 */
@Directive({
  selector: 'img[alt]',
  host: {
    '[style.cursor]': '"pointer"',
    '[attr.title]': 'alt()',
    '(mouseenter)': 'onHover($event)'

  }
})
export class ImageAlt {

  readonly alt = input('')

  onHover(event: Event) {
    const img = event.target as HTMLImageElement;
    const altText = img.alt;
    console.log(`Image alt text: ${altText}`);
  }

  constructor() {
    effect(() => {
      console.log(`El valor de alt: ${this.alt()}`)
    })
  }
}
