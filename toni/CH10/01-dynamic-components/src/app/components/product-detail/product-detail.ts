import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  imports: [CurrencyPipe], // Importamos la tubería nativa para dar formato de dinero en la vista
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent {
  /**
   * EL RECEPTOR DE INFORMACIÓN (SIGNAL INPUT):
   * Este componente es una "pieza pasiva de presentación".
   * Recibe de forma obligatoria el producto seleccionado desde el componente principal de la App.
   * Al ser un input basado en Signals moderno, en cuanto el inyector dinámico actualice el producto
   * elegido en la otra punta de la aplicación, este componente se enterará e iluminará la pantalla
   * con los nuevos datos al instante, de forma 100% limpia y reactiva.
   */
  readonly product = input.required<Product>();
}
