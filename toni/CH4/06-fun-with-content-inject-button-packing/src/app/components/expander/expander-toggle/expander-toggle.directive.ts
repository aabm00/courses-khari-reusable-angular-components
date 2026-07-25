import { Directive, inject } from "@angular/core";
import { ExpanderComponent } from "../expander.component";


@Directive({
  selector: '[expander-toggle]',
  host: {
    '(click)': 'onClick()'
  }
})
export class ExpanderToggle {

  /**
   * =========================================================================================
   * 🛡️ PATRÓN: INYECCIÓN OPCIONAL DEFENSIVA (Fault-Tolerant Hierarchical Injection)
   * =========================================================================================
   * ¿Por qué añadimos '{ optional: true }'?:
   * En sistemas de diseño empresariales, los desarrolladores cometen errores. Si alguien pega
   * el atributo 'expander-toggle' en un botón fuera de un acordeón (como el <button> "Hello"
   * en la línea 1 de tu app.html), el motor de Angular subirá por el DOM, no encontrará ningún
   * 'ExpanderComponent' y provocará un crash inmediato de toda la aplicación.
   *
   * Al marcarlo como opcional, le decimos a Angular: "Si no encuentras al padre superior, no falles;
   * simplemente asígnale un valor 'null' a la variable".
   * =========================================================================================
   */
  readonly expanderComponent = inject(ExpanderComponent, { optional: true})

  onClick() {
    /**
     * OPERADOR DE ENCADENAMIENTO OPCIONAL (?.):
     * Protege la ejecución en tiempo de ejecución. Si la directiva se usó correctamente dentro
     * de un expander, ejecutará '.toggle()'. Si se usó erróneamente fuera (como el botón "Hello"),
     * la expresión se evalúa como 'undefined' de forma segura y silenciosa sin romper la web.
     */
    this.expanderComponent?.toggle()

  }

}

