import { InjectionToken } from '@angular/core';
import { Product } from '../models/product.model';

export type ItemSelectFn = (product: Product) => void;

/**
 * EL SUSTITUTO DE LOS OUTPUTS:
 * Como 'ngComponentOutlet' no puede escuchar eventos '(selection)' tradicionales en el HTML,
 * creamos esta interfaz con la función callback 'onItemSelect'. Viajará dentro del inyector hijo.
 */
export interface ViewActions {
  readonly onItemSelect: ItemSelectFn;
}

export const VIEW_ACTIONS = new InjectionToken<ViewActions>('VIEW_ACTIONS');
