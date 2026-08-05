import { Component, signal } from '@angular/core';
import { MyIf } from './directives/my-if.directive';
import { CommonModule } from '@angular/common';
import { Point } from './models/point';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MyIf],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Señal booleana estándar para pruebas de visibilidad condicional básica */
  readonly flag = signal(true);
  /**
   * Señal polimórfica que puede almacenar un objeto de coordenadas o ser totalmente nulo.
   * Ideal para comprobar cómo la directiva filtra los estados nulos en tiempo de ejecución.
   */
  readonly obj = signal<Point | null>({x: 20, y: 30});

   /** Cambia el estado de la bandera entre verdadero y falso */
  toggleFlag() {
    this.flag.update(v => !v);
  }

  /** Intercambia el valor del objeto: si existe lo vuelve null, si es null lo vuelve a rellenar */
  toggleObj() {
    this.obj.update(v => (!!v) ? null : {x: 20, y: 30});
  }
}
