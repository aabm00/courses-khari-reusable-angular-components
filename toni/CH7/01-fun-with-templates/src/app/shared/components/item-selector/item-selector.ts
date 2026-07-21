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
  readonly itemTemplate = contentChild<TemplateRef<any>>(TemplateRef)
  readonly hasItemTemplate = computed(() => !!this.itemTemplate())
}

export const ItemSelector = [
  ItemSelectorComponent,
  ItemTemplateDirective
]
