import { Component, contentChild, contentChildren, effect, ElementRef } from '@angular/core';
import { Item } from '../item/item';

@Component({
  selector: 'app-container',
  imports: [],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {
  /**
   * =========================================================================================
   * 🔍 CONSULTAS MULTIPLICITARIAS DE CONTENIDO CON RASTREO PROFUNDO (contentChildren Deep Query)
   * =========================================================================================
   * - 'contentChildren(Item)': Captura un array reactivo con todas las coincidencias del
   *   componente 'Item' que el padre proyecte en la ranura <ng-content>. En Angular 22, al ser
   *   un Signal, emite automáticamente un nuevo valor si el array de elementos muta dinámicamente.
   *
   * 📐 LA PROPIEDAD 'descendants: true' (Rastreo de Anidamiento):
   *   - Por defecto, Angular realiza búsquedas "superficiales" (descendants: false). Solo mira
   *     los hijos directos de la proyección.
   *   - Al configurar 'descendants: true', ordenamos al framework realizar una inspección profunda
   *     en todo el árbol de nodos proyectado. Esto permite localizar al '<app-item uid="500 nested">'
   *     a pesar de estar oculto y envuelto dentro de una etiqueta '<div>' ajena al componente.
   *
   * 🔮 CONFIGURACIÓN OPTATIVA 'read' (Clase vs DOM):
   *   - Por defecto (sin la propiedad 'read'), Angular te devuelve la instancia lógica de la clase
   *     TypeScript ('Item'), dándote acceso a sus métodos públicos e inputs reactivos (como '.uid()').
   *   - Si descomentaras 'read: ElementRef', Angular alteraría el tipo de retorno y te entregaría la
   *     referencia física nativa del DOM ('HTMLElement'), permitiéndote mutar estilos o leer dimensiones
   *     gráficas nativas de la etiqueta en el navegador.
   * =========================================================================================
   */
  readonly items = contentChildren(Item,
    {
      // read: ElementRef, // Return the native DOM element reference instead of the TypeScript class instance.
      descendants: true // Enables deep tracking; Angular will find 'Item' components even if they are nested inside other HTML wrappers
    });

  constructor() {
    /**
     * EFECTO REACTIVO DE MONITORIZACIÓN:
     * Al estar integrado en la era de los Signals, el framework monitoriza el árbol bajo demanda.
     * El 'effect' se ejecutará limpiamente solo cuando el array de elementos proyectados sufra
     * una alteración física real en el DOM de la aplicación.
     */
    effect(() => {
      console.log(this.items())
    })
  }
}
