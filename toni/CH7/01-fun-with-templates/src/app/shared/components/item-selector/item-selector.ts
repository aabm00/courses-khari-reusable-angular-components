import { Component, computed, input, model, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Requerido para resolver la directiva estructural ngTemplateOutlet

@Component({
  selector: 'app-item-selector',
  imports: [CommonModule], // Importación mandatoria para usar mecanismos dinámicos de plantillas
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

  // ENTRADA DE PLANTILLA PERSONALIZADA (DEVELOPS FLEXIBILITY)
  // Declaramos un Signal Input opcional que acepta referencias de bloques de código de plantillas (<ng-template>).
  readonly itemTemplate = input<TemplateRef<any>>() // Plantilla que viene del padre

  // SEÑAL COMPUTADA PARA CONTROL DE FLUJO
  // Derivamos de forma ultra eficiente un booleano para saber instantáneamente si se inyectó una plantilla o no.
  // Evita evaluaciones repetitivas innecesarias en los ciclos de renderizado de la vista.
  readonly hasItemTemplate = computed(() => !!this.itemTemplate())
}
