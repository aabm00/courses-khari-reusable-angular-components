import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { VIEW_ACTIONS } from '../../tokens/view-actions.token';

@Component({
  selector: 'app-list-view',
  imports: [CurrencyPipe],
  templateUrl: './list-view.html',
  styleUrl: './list-view.scss',
})
export class ListViewComponent {
  readonly items = input.required<Product[]>();
  readonly selection = output<Product>();

  /** Inyectamos las acciones opcionales provistas en la sombra por el inyector del padre */
  readonly viewActions = inject(VIEW_ACTIONS, {optional: true});

  onItemClick(product: Product) {
    // Ejecutamos ambos canales de comunicación para garantizar la retrocompatibilidad
    this.selection.emit(product);
    this.viewActions?.onItemSelect(product);
  }
}
