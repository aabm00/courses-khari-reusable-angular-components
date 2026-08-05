import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { WithDateLocale } from './directives/with-date-locale.directive';

@Component({
  selector: 'app-root',
  imports: [CommonModule, MatDatepickerModule, FormsModule, WithDateLocale],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  /** Listado fijo de idiomas internacionales disponibles para poner a prueba el calendario */
  readonly locales = signal([
    'en-US', // Inglés Estados Unidos (Semana arranca en Domingo)
    'fr-FR', // Francés Francia (Semana arranca en Lunes)
    'de-DE', // Alemán Alemania
    'ja-JP', // Japonés Japón
    'he-IL', // Hebreo Israel (Lectura de Derecha a Izquierda - RTL)
    'ar-EG', // Árabe Egipto (Lectura de Derecha a Izquierda - RTL)
    'zh-CN'  // Chino Simplificado
  ]);

  /** Inicializamos la señal de selección apuntando por defecto al idioma francés ('fr-FR') */
  readonly selectedLocale = signal(this.locales()[1]);
}
