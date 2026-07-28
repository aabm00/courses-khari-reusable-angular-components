import { Component, computed, contentChild, input, model, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  // DETECCIÓN AUTOMÁTICA MEDIANTE QUERY DE SEÑAL (CONTENT CHILD)
  // Reemplazamos el antiguo input() por un contentChild(). Angular inspecciona el contenido
  // proyectado (etiquetas hijas) buscando una referencia de tipo TemplateRef.
  // Al ser una Signal, si el contenido cambia dinámicamente, la vista se actualizará sola.
  readonly itemTemplate = contentChild<TemplateRef<any>>(TemplateRef)

  // Mantenemos la misma señal computada. La plantilla de la vista (.html) no requiere
  // ninguna modificación estructural, ya que sigue consumiendo esta señal.
  readonly hasItemTemplate = computed(() => !!this.itemTemplate())
}
