import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-item-selector',
  imports: [],
  templateUrl: './item-selector.html',
  styleUrl: './item-selector.scss',
})
export class ItemSelectorComponent {

  // INPUTS DE SÓLO LECTURA (SIGNAL INPUTS)
  // Requerimos estrictamente el título y la colección de opciones desde el padre.
  readonly title = input.required<string>()
  readonly options = input.required<string[]>()

  // ENLAZADO BIDIRECCIONAL REVOLUCIONARIO (MODEL SIGNAL)
  // 'model()' simplifica el flujo de datos. Expone un canal de entrada y emite
  // un evento (selectedOptionChange) automáticamente al mutar su valor.
  readonly selectedOption = model('')

  /**
   * Actualiza el valor del modelo reactivo.
   * Al invocar '.set()', notificamos al padre de inmediato sin necesidad de gestionar EventEmitters.
   */
  select(option: string) {
    this.selectedOption.set(option)
  }
}
