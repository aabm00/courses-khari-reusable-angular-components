import { Component, input } from '@angular/core';

/**
 * =========================================================================================
 * 📦 COMPONENTE PRESENTACIONAL PURO (Rígido / Data-Driven Leaf Component)
 * =========================================================================================
 * Siguiendo las reglas de oro de la arquitectura modular que analizamos en capítulos anteriores,
 * este componente actúa como un nodo hoja. No proyecta nada, no gestiona estados dinámicos complejos,
 * ni altera a sus padres. Es una pieza de datos rígida guiada por entradas estrictas.
 *
 * - 'input.required<string>()': Garantiza que ningún contenedor padre pueda instanciar un '<app-item>'
 *   sin proveer una cadena identificadora única. Actúa como el contrato de datos del componente.
 * =========================================================================================
 */
@Component({
  selector: 'app-item',
  imports: [],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item {
  readonly uid = input.required<string>();

}
