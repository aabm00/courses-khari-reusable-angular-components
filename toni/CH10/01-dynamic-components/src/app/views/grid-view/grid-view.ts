import { Component, inject, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { VIEW_ACTIONS } from '../../tokens/view-actions.token';

@Component({
  selector: 'app-grid-view',
  imports: [CurrencyPipe],
  templateUrl: './grid-view.html',
  styleUrl: './grid-view.scss',
})
export class GridViewComponent {
  readonly items = input.required<Product[]>();
  readonly selection = output<Product>();

  /**
   * LA CLAVE DE LA INTERCONEXIÓN (FASE 2):
   * Inyectamos el token 'VIEW_ACTIONS' de forma opcional. Si este componente se levanta
   * a través de 'ngComponentOutlet', leerá el inyector cargado por el padre y obtendrá las funciones.
   */
  readonly viewActions = inject(VIEW_ACTIONS, {optional: true});

  onItemClick(product: Product) {
    /**
     * COMPATIBILIDAD DOBLE DURANTE LA MIGRACIÓN:
     * 1. Emitimos por el output tradicional (por si se consume de forma estática en otro sitio).
     * 2. Invocamos de forma intuitiva el callback inyectado para avisar al inyector dinámico del padre.
     */
    this.selection.emit(product);
    this.viewActions?.onItemSelect(product);
  }
}
