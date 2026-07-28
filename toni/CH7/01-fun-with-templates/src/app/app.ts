import { Component, signal } from '@angular/core';
import { COLOR_NAMES, FONT_NAMES, SIZES } from './data/constants';
// IMPORTACIÓN CONSOLIDADA: Traemos el paquete completo con un único token
import { ItemSelector } from './shared/components/item-selector/item-selector'; // Component + Directive


@Component({
  selector: 'app-root',
  imports: [ItemSelector], // Registramos el array completo: menor fricción visual
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly possibleColors = signal(COLOR_NAMES);
  readonly possibleFonts = signal(FONT_NAMES);
  readonly possibleSizes = signal(SIZES);

  readonly selectedColor = signal(this.possibleColors()[0]);
  readonly selectedFont = signal(this.possibleFonts()[0]);
  readonly selectedSize = signal(this.possibleSizes()[0]);
}
