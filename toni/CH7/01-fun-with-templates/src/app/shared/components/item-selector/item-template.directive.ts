import { Directive, inject, TemplateRef } from '@angular/core';

export interface ItemTemplateContext {
  readonly $implicit: string
}

@Directive({
  selector: '[appItemTemplate]'
})
export class ItemTemplateDirective {

  readonly template = inject(TemplateRef<ItemTemplateContext>)

  /** TEMPLATE CONTEXT GUARD (Strict Type Checking):
   * This static method acts as a compile-time guard for Angular's language service.
   * It tells the HTML compiler exactly what data structure flows through the template context.
   * By returning 'ctx is ItemTemplateContext', it ensures that variables declared in the HTML
   * (like '*appItemTemplate="let color"') are strictly typed as 'string' instead of 'any'.
   */
  static ngTemplateContextGuard( _: ItemTemplateDirective, ctx: unknown): ctx is ItemTemplateContext {
    return true
  }
}
