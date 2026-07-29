import { Component, computed, contentChild, input, model, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemTemplateDirective } from './item-template.directive';
import { ItemContainerDirective } from './item-container.directive';

@Component({
  selector: 'app-item-selector',
  imports: [CommonModule],
  templateUrl: './item-selector.html',
  styleUrl: './item-selector.scss',
})
export class ItemSelectorComponent {
  readonly title = input.required<string>();
  readonly options = input.required<string[]>();
  readonly selectedOption = model('');

  /**
   * Método encargado de actualizar la señal bidireccional 'selectedOption'.
   * Al invocar '.set()', el nuevo estado se propaga inmediatamente hacia el componente padre.
   */
  select(option: string) {
    this.selectedOption.set(option);
  }

  /**
   * INFRAESTRUCTURA DE CONSULTA PARA EL TEXTO INTERNO (TIER 2):
   * 'contentChild' es una Signal Query moderna que busca reactivamente en las etiquetas hijas
   * proyectadas si el usuario ha suministrado la directiva 'ItemTemplateDirective'.
   * Derivamos una señal computada booleana para saber si existe, y otra señal computada
   * para extraer de forma segura el plano arquitectónico ('TemplateRef') alojado en su interior.
   */
  readonly itemTemplateDirective = contentChild(ItemTemplateDirective);
  readonly hasItemTemplate = computed(() => !!this.itemTemplateDirective());
  readonly itemTemplate = computed(() => this.itemTemplateDirective()?.template ?? null);

  /**
   * INFRAESTRUCTURA DE CONSULTA PARA EL CONTENEDOR EXTERNO (TIER 1):
   * Funciona bajo la misma mecánica de Query de Señal, pero busca la directiva avanzada 'ItemContainerDirective'.
   * Si el usuario la declara en el HTML exterior, esta señal capturará la instancia de la directiva,
   * permitiendo extraer el 'TemplateRef' total del nodo raíz del chip para activar la máxima personalización.
   */
  readonly itemContainerDirective = contentChild(ItemContainerDirective);
  readonly hasItemContainer = computed(() => !!this.itemContainerDirective());
  readonly itemContainer = computed(() => this.itemContainerDirective()?.template ?? null);
}

/**
 * PAQUETE DE EXPORTACIÓN ÚNICO (COMPLIANT CON KOBI HARI):
 * Agrupamos el componente y sus dos directivas satélites en una constante tipada.
 * De este modo, cualquier componente externo solo necesita realizar una única importación
 * (import { ItemSelector } from ...) para desbloquear todas las capacidades del selector.
 */
export const ItemSelector = [
  ItemSelectorComponent,
  ItemTemplateDirective,
  ItemContainerDirective
];
