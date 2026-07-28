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

  readonly title = input.required<string>()
  readonly options = input.required<string[]>()

  /**
   * VINCULACIÓN BIDIRECCIONAL REVOLUCIONARIA (Model Signals):
   * En Angular moderno, 'model()' crea un canal de comunicación de doble sentido.
   * Reemplaza de un plumazo la verbosidad de declarar un '@Input()' y un '@Output() Change'
   * por separado, permitiendo al padre usar la sintaxis limpia '[(selectedOption)]'.
   */
  readonly selectedOption = model('')

  select(option: string) {
    this.selectedOption.set(option)
  }

  /**
   * =========================================================================================
   * 🔍 SISTEMA DE CONSULTA DE CONTENIDO DE TRES TIERS (Polymorphic View Querying)
   * =========================================================================================
   * El componente monitoriza de forma reactiva si el consumidor (padre) está inyectando planos de
   * renderizado personalizados a través de directivas satélite:
   *
   * TIER 1: 'itemTemplateDirective' -> Consulta si el desarrollador quiere cambiar solo
   *         el CONTENIDO interno de las pastillas tradicionales de texto.
   *
   * TIER 2: 'itemContainerDirective' -> Consulta si el desarrollador quiere tomar el control
   *         TOTAL de la etiqueta envolvente (la celda o ficha completa del bucle).
   *
   * * OPTIMIZACIÓN DE MEMORIA CON COMPUTED: Al encapsular el filtrado en señales computadas,
   *   Angular memoiza las referencias de las plantillas de solo lectura en cache. No hay coste
   *   de procesamiento en ciclos repetitivos de pintado, garantizando compatibilidad 'Zoneless'.
   * =========================================================================================
   */
  readonly itemTemplateDirective = contentChild(ItemTemplateDirective)
  readonly hasItemTemplate = computed(() => !!this.itemTemplateDirective())
  readonly itemTemplate = computed(() => this.itemTemplateDirective()?.template ?? null)

  readonly itemContainerDirective = contentChild(ItemContainerDirective)
  readonly hasItemContainer = computed(() => !!this.itemContainerDirective())
  readonly itemContainer = computed(() => this.itemContainerDirective()?.template ?? null)


}

/**
 * =========================================================================================
 * 📦 CONSTANTE DE CO-LOCACIÓN EMPAQUETADA (Composite Import Bundle)
 * =========================================================================================
 * En lugar de obligar al consumidor a importar tres cosas distintas en su componente:
 * imports: [ItemSelectorComponent, ItemTemplateDirective, ItemContainerDirective]
 * Agrupamos todo el ecosistema dinámico en un único array exportable. Al hacer 'imports: [ItemSelector]'
 * en app.component.ts, habilitamos de forma segura el set completo de herramientas y directivas de asterisco.
 * =========================================================================================
 */
export const ItemSelector = [
  ItemSelectorComponent,
  ItemTemplateDirective,
  ItemContainerDirective
]
