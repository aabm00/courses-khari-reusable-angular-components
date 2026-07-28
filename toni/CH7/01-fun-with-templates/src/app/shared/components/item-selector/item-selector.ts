import { Component, computed, contentChild, input, model, TemplateRef } from '@angular/core';
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

  // CONEXIÓN GENÉRICA (DEUDA TÉCNICA TEMPORAL):
  // Buscamos 'TemplateRef' de forma directa en el árbol de contenido proyectado.
  // Como busca la clase base 'TemplateRef' de Angular, capturará CUALQUIER <ng-template>
  // que el padre ponga dentro, tenga o no tenga la directiva 'appItemTemplate' adjunta.
  readonly itemTemplate = contentChild<TemplateRef<any>>(TemplateRef)
  readonly hasItemTemplate = computed(() => !!this.itemTemplate())
}

/**
 * PATRÓN BUNDLE DE COMPONENTES (CO-LOCACIÓN):
 * Exportamos un array consolidado para simplificar la API pública.
 * Los desarrolladores que consuman 'app-item-selector' solo importarán 'ItemSelector',
 * obteniendo el componente y todas sus directivas configuradas de un plumazo.
 */
export const ItemSelector = [
  ItemSelectorComponent,
  ItemTemplateDirective
]
