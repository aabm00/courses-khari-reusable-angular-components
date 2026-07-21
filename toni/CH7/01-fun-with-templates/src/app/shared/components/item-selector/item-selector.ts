import { Component, computed, contentChild, input, model, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemTemplateDirective } from './item-template.directive';


@Component({
  selector: 'app-item-selector',
  imports: [CommonModule],
  templateUrl: './item-selector.html',
  styleUrl: './item-selector.scss',
})
export class ItemSelectorComponent {

  readonly title = input.required<string>()
  readonly options = input.required<string[]>()

  // Bidirectional binding
  readonly selectedOption = model('')

  select(option: string) {
    this.selectedOption.set(option)
  }

  // Template comming from parent
  readonly itemTemplateDirective = contentChild(ItemTemplateDirective)
  readonly hasItemTemplate = computed(() => !!this.itemTemplateDirective())
  readonly itemTemplate = computed(() => this.itemTemplateDirective()?.template ?? null)
}

export const ItemSelector = [
  ItemSelectorComponent,
  ItemTemplateDirective
]
