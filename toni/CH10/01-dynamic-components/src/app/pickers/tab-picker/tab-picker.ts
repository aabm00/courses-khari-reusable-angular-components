import { Component, input, model } from '@angular/core';
import { SelectOption } from '../../models/select-option.model';

@Component({
  selector: 'app-tab-picker',
  templateUrl: './tab-picker.html',
  styleUrl: './tab-picker.scss',
})
export class TabPickerComponent {
  readonly options = input.required<SelectOption[]>();
  readonly value = model.required<string>();

  /** Al pulsar una pestaña, actualiza el valor del modelo propagándolo hacia el componente padre */
  select(val: string) {
    this.value.set(val);
  }
}
