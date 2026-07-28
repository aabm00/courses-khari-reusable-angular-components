import { Component, signal } from '@angular/core';
import { COLOR_NAMES, FONT_NAMES, SIZES } from './data/constants';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // CONFIGURACIÓN DE DATOS MAESTROS (ESTADO DE SÓLO LECTURA)
  // Mantenemos las colecciones de opciones envueltas en Signals para persistir reactividad fluida.
  readonly possibleColors = signal(COLOR_NAMES);
  readonly possibleFonts = signal(FONT_NAMES);
  readonly possibleSizes = signal(SIZES);

  // ESTADO INTERNO DEL EDITOR
  // Inicializamos cada estado con el primer elemento de su respectiva colección.
  readonly selectedColor = signal(this.possibleColors()[0]);
  readonly selectedFont = signal(this.possibleFonts()[0]);
  readonly selectedSize = signal(this.possibleSizes()[0]);

  /**
   * REVISIÓN DE ARQUITECTURA (DEUDA TÉCNICA):
   * Los siguientes tres métodos son idénticos en comportamiento, variando solo en la Signal que mutan.
   * En la Fase 1 eliminaremos por completo esta redundancia en el controlador delegando la escritura
   * directamente a un componente hijo mediante un 'Model Signal' (two-way binding nativo).
   */
  onColorChange(color: string): void {
    this.selectedColor.set(color);
  }

  onFontChange(font: string): void {
    this.selectedFont.set(font);
  }

  onSizeChange(size: string): void {
    this.selectedSize.set(size);
  }
}
