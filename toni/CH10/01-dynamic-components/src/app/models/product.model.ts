/**
 * CONTRATO DE ESTRUCTURA DEL PRODUCTO:
 * Define de forma inmutable (readonly) todas las propiedades que componen un artículo
 * de nuestro catálogo. Al estar fuertemente tipado, el autocompletado del HTML sabe exactamente
 * que 'product.price' es un número y 'product.name' es un texto, evitando erratas.
 */
export interface Product {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly price: number;
  readonly rating: number;
  readonly imageUrl: string;
}
