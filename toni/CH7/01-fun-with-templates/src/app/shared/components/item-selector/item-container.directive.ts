import { Directive, inject, TemplateRef } from '@angular/core';

export interface ItemContainerContext {

  readonly $implicit: string
  readonly isSelected: boolean
  readonly onSelect: () => void
}


@Directive({
  selector: '[appItemContainer]'
})
export class ItemContainerDirective {

  readonly template = inject(TemplateRef<ItemContainerContext>)

  /** TEMPLATE CONTEXT GUARD (Strict Type Checking):
   * This static method acts as a compile-time guard for Angular's language service.
   * It tells the HTML compiler exactly what data structure flows through the template context.
   * By returning 'ctx is ItemTemplateContext', it ensures that variables declared in the HTML
   * (like '*appItemTemplate="let color"') are strictly typed as 'string' instead of 'any'.
   */

  /**
   * =========================================================================================
   * 🛡️ COMPILACIÓN SEGURA CON CONTEXTO EXTENDIDO (Multi-Variable Context Guard)
   * =========================================================================================
   * A diferencia del template interno, la directiva del contenedor inyecta una estructura compleja
   * de tres propiedades al HTML del consumidor: el valor, un estado visual y una función de acción.
   *
   * Al declarar este guard estático, el editor de código del programador (IntelliSense) sabrá de forma
   * instantánea y en tiempo de compilación que:
   *   - 'let-value' es estrictamente un 'string'.
   *   - 'let-selected' es estrictamente un 'boolean'.
   *   - 'let-action' es estrictamente una función ejecutable sin argumentos '() => void'.
   * =========================================================================================
   */
  static ngTemplateContextGuard( _: ItemContainerDirective, ctx: unknown): ctx is ItemContainerContext {
    return true
  }
}
