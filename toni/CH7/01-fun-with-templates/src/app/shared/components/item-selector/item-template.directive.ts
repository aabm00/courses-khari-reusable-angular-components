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

  /**
   * =========================================================================================
   * 🛡️ ARQUITECTURA DE SEGURIDAD EN TIEMPO DE COMPILACIÓN (Template Context Guard Pattern)
   * =========================================================================================
   * Por defecto, cuando declaras una variable contextual en el HTML de Angular (ej: 'let-color'),
   * el motor de plantillas la evalúa con el tipo flexible 'any'. Esto inhabilita el autocompletado
   * y oculta errores ortográficos críticos hasta que la app truena en el navegador.
   *
   * ¿Cómo opera 'ngTemplateContextGuard'?
   * Es una firma de método estático interpretada exclusivamente por el Language Service de Angular
   * en tiempo de compilación. Genera un predicado de tipo estricto ('ctx is ItemTemplateContext').
   *
   * Al retornar 'true', le garantiza al compilador HTML de tu editor que toda variable capturada
   * mediante este asterisco deja de ser genérica y adopta el tipado estricto 'string', activando
   * el chequeo de errores del compilador en tiempo real. Cero errores en producción.
   * =========================================================================================
   */
  static ngTemplateContextGuard( _: ItemTemplateDirective, ctx: unknown): ctx is ItemTemplateContext {
    return true
  }
}
