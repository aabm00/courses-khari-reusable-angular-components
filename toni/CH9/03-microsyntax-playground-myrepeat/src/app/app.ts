import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRepeat } from "./directives/my-repeat.directive";

@Component({
  selector: 'app-root',
  imports: [CommonModule, MyRepeat],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /**
   * FUENTES DE LA VERDAD (ESTADO GLOBAL):
   * Definimos tres señales reactivas independientes que controlan el comportamiento del repetidor.
   * Al estar enlazadas en el HTML, cualquier cambio aquí disparará el efecto interno de la directiva.
   */
  readonly count = signal(5);   /** Fila iniciales a dibujar al arrancar la aplicación */
  readonly start = signal(0);   /** Número base desde el que empezará a sumar la primera fila */
  readonly skip = signal(1);    /** El multiplicador o incremento constante entre cada ítem */

  /** Incrementa el contador de elementos en 1 */
  incrementCount() {
    this.count.update(v => v + 1);
  }

  /** Reduce el contador asegurando con 'Math.max' que nunca baje de 0 para no romper la vista */
  decrementCount() {
    this.count.update(v => Math.max(v - 1, 0));
  }

  /** Incrementa el salto numérico entre filas */
  incrementSkip() {
    this.skip.update(v => v + 1);
  }

  /**
   * Reduce el salto fijando el mínimo en 1.
   * Esto es clave para evitar saltos de 0 que congelarían los valores de los ítems en el mismo número.
   */
  decrementSkip() {
    this.skip.update(v => Math.max(v - 1, 1));
  }

  /** Incrementa el valor inicial de la secuencia */
  incrementStart() {
    this.start.update(v => v + 1);
  }

  /** Reduce el valor inicial de la secuencia */
  decrementStart() {
    this.start.update(v => v - 1);
  }
}
