import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectOption } from '../../models/select-option.model';

@Component({
  selector: 'app-select-picker',
  imports: [FormsModule],
  templateUrl: './select-picker.html',
  styleUrl: './select-picker.scss',
})
export class SelectPickerComponent {
  /** Recibe el listado de opciones a pintar en el menú desplegable */
  readonly options = input.required<SelectOption[]>();

  /** Modelo bidireccional reactivo que notifica y lee la vista seleccionada en tiempo real */
  readonly value = model.required<string>();
}
