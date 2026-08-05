import { InjectionToken, InputSignal, ModelSignal, Type } from '@angular/core';
import { SelectOption } from '../models/select-option.model';

/**
 * CONTRATO PARA LOS SELECTORES DINÁMICOS (PICKERS):
 * Obligamos a que cualquier componente selector (Pestañas, Desplegables) exponga
 * un input 'options' y un model bidireccional 'value' basado en Signals.
 */
export interface ViewPicker {
  readonly options: InputSignal<SelectOption[]>;
  readonly value: ModelSignal<string>;
}

/**
 * EL SELECTOR CONFIGURABLE (VIEW_PICKER):
 * Token de inyección que le dice a la app qué componente exacto usar en la cabecera
 * para cambiar de vista. Si en la configuración cambias la clase del desplegable por
 * la de pestañas, el diseño muta por completo sin tocar el marcado de la aplicación.
 */
export const VIEW_PICKER = new InjectionToken<Type<ViewPicker>>('VIEW_PICKER');
