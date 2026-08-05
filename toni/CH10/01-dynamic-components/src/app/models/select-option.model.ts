/**
 * CONTRATO PARA MENÚS Y PESTAÑAS:
 * Una interfaz ultra genérica y reutilizable diseñada para alimentar selectores de opciones.
 * Define que cada opción necesita un texto legible para el usuario ('label') y un identificador
 * interno para el código de la aplicación ('value').
 */
export interface SelectOption {
  readonly label: string;
  readonly value: string;
}
