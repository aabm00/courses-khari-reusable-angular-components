import { Component, signal } from '@angular/core';
import { COLOR_NAMES, FONT_NAMES, SIZES } from './data/constants';
// IMPORTACIÓN ÚNICA: Importamos el nuevo bloque de construcción reutilizable
import { ItemSelectorComponent } from './shared/components/item-selector/item-selector';

@Component({
  selector: 'app-root',
  imports: [ItemSelectorComponent], // Declaración obligatoria en standalone components
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Colecciones maestras fijas envueltas en Signals
  readonly possibleColors = signal(COLOR_NAMES);
  readonly possibleFonts = signal(FONT_NAMES);
  readonly possibleSizes = signal(SIZES);

  // Estados de selección independientes
  readonly selectedColor = signal(this.possibleColors()[0]);
  readonly selectedFont = signal(this.possibleFonts()[0]);
  readonly selectedSize = signal(this.possibleSizes()[0]);

  /**
   * BENEFICIO ARQUITECTÓNICO:
   * Los métodos manuales de actualización han sido borrados de aquí.
   * La mutación del estado ocurre tras bambalinas gracias al 'model()' del componente hijo.
   */

  // onColorChange(color: string): void {
  //   this.selectedColor.set(color);
  // }

  // onFontChange(font: string): void {
  //   this.selectedFont.set(font);
  // }

  // onSizeChange(size: string): void {
  //   this.selectedSize.set(size);
  // }
}
