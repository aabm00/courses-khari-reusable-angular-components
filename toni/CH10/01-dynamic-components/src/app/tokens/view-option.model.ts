import { InjectionToken, InputSignal, Type } from '@angular/core';
import { Product } from '../models/product.model';

/**
 * CONTRATO PARA LAS VISTAS DINÁMICAS:
 * Obligamos a que cualquier componente de vista (Grid, List, Cards) tenga un input
 * obligatorio de tipo Signal llamado 'items' que reciba la lista de productos.
 */
export interface ViewComponent {
  readonly items: InputSignal<Product[]>;
}

/**
 * CONFIGURACIÓN INDIVIDUAL DE CADA VISTA:
 * Define la estructura para registrar una vista en el sistema: su etiqueta visible ('label'),
 * su identificador interno ('value') y la clase de TypeScript del componente ('component').
 */
export interface ViewOption {
  readonly label: string;
  readonly value: string;
  readonly component: Type<ViewComponent>;
}

/**
 * EL BUZÓN DE REUSABILIDAD (VIEW_OPTIONS):
 * Este token funciona como un contenedor centralizado. La aplicación leerá este token
 * para saber cuántas y cuáles vistas tiene permitido dibujar, sin grabarlas a fuego en el HTML.
 */
export const VIEW_OPTIONS = new InjectionToken<ViewOption[]>('VIEW_OPTIONS');
