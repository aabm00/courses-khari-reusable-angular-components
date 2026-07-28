import { Component, computed, contentChild, effect, input, model, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemTemplateDirective } from './item-template.directive';


@Component({
  selector: 'app-item-selector',
  imports: [CommonModule],
  templateUrl: './item-selector.html',
  styleUrl: './item-selector.scss',
})
export class ItemSelectorComponent {

  readonly title = input.required<string>()
  readonly options = input.required<string[]>()

  // Bidirectional binding
  readonly selectedOption = model('')

  select(option: string) {
    this.selectedOption.set(option)
  }

  /**
   * RECOLECCIÓN DE LA INSTANCIA DE LA DIRECTIVA:
   * Al hacer 'contentChild(ItemTemplateDirective)', Angular escanea las etiquetas hijas proyectadas.
   * Lo que recuperamos aquí es estrictamente una INSTANCIA DE LA CLASE TypeScript de la directiva.
   * No recuperamos el nodo HTML ni la plantilla en sí; recuperamos el objeto controlador 'ItemTemplateDirective'.
   */
  readonly itemTemplateDirective = contentChild(ItemTemplateDirective)

  /**
   * SEÑAL COMPUTADA DE CONFIRMACIÓN:
   * Simplemente evalúa si la señal del contentChild tiene una instancia válida adentro (true) o está vacía (false).
   */
  readonly hasItemTemplate = computed(() => !!this.itemTemplateDirective())

  /**
   * EXTRACCIÓN DEL PLANO ARQUITECTÓNICO (TEMPLATEREF):
   * Aquí es donde se hace la magia. Accedemos a la instancia de la directiva y leemos su propiedad '.template'.
   * Recordando el código de la directiva, 'template' almacena un 'TemplateRef<any>'.
   * IMPORTANTE: Un 'TemplateRef' NO es código HTML plano ni un elemento nativo del DOM. Es un objeto interno
   * de Angular que funciona como un 'molde' o 'plano de fabricación'. Le dice al motor de renderizado:
   * "Aquí tengo las instrucciones para clonar y dibujar este trozo de interfaz cuando lo necesites".
   * Si la directiva no existe, devolvemos 'null' de forma segura.
   */
  readonly itemTemplate = computed(() => this.itemTemplateDirective()?.template ?? null)

  /**
   * CONSTRUCTOR DE DEPURACIÓN (MECANISMO REACTIVO):
   * En Angular moderno las consultas de contenido son Signals. En el constructor puro
   * el valor siempre sería 'undefined' porque la vista aún no se ha procesado.
   * Usamos un 'effect()' para escuchar reactivamente el momento exacto en que Angular
   * encuentra la directiva y así imprimir su estructura real en la consola de desarrollador.
   */
  constructor() {
    effect(() => {
      const directiveInstance = this.itemTemplateDirective();
      if (directiveInstance) {
        console.log('--- 🛡️ INSPECCIÓN ITEM-SELECTOR (' + this.title() + ') ---');
        console.log('1. Instancia recuperada por contentChild:', directiveInstance);
        console.log('2. ¿Es una clase Directive?:', directiveInstance instanceof ItemTemplateDirective);
        console.log('3. TemplateRef interno de esa directiva:', directiveInstance.template);
      }
    });
  }
}

export const ItemSelector = [
  ItemSelectorComponent,
  ItemTemplateDirective
]
