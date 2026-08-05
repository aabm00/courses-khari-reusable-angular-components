import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { VIEW_ACTIONS } from '../../tokens/view-actions.token';

@Component({
  selector: 'app-cards-view',
  imports: [CurrencyPipe],
  templateUrl: './cards-view.html',
  styleUrl: './cards-view.scss',
})
export class CardsViewComponent {
  readonly items = input.required<Product[]>();
  readonly selection = output<Product>();

  /** Leemos las acciones del inyector dinámico evitando tener outputs huérfanos */
  readonly viewActions = inject(VIEW_ACTIONS, {optional: true});

  onItemClick(product: Product) {
    this.selection.emit(product);
    this.viewActions?.onItemSelect(product);
  }
}
