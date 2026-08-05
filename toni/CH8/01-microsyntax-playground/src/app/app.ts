import { Component, signal } from '@angular/core';
import { MyFor } from './directives/my-for.directive';
import { MyIf } from './directives/my-if.directive';
import { MyRepeat } from './directives/my-repeat.directive';
import { MyTimer } from './directives/my-timer.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  /** Importación explícita de las directivas standalone de microsintaxis y utilidades comunes */
  imports: [CommonModule, MyFor, MyIf, MyRepeat, MyTimer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Señal de intervalo numérica para alimentar el temporizador */
  readonly times = signal(50)
  /** Señal polimórfica (string o nulo) idónea para poner a prueba la guardia genérica de MyIf */
  readonly value = signal<string | null>(null) // for myIf directive
  /** Colección maestra de caracteres encargada de disparar la inferencia <string> en MyFor */
  readonly items = signal(['a', 'b', 'c']) // for myFor directive
  // readonly items = signal([{x:10, y:20}, {x:30, y:40}, {x:50, y:60}])
}
