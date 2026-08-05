import { computed, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 * LIMPIADOR DE VALORES FALSOS:
 * Este tipo auxiliar simplemente coge el tipo original 'T' y le extirpa cualquier valor
 * que JavaScript considere "falso" (como null, undefined, false, 0 o un texto vacío "").
 * Esto garantiza que lo que llegue a la plantilla sea un objeto 100% real y seguro de usar.
 */
type MyIfTruthy<T> = Exclude<T, false | 0 | "" | null | undefined>

/**
 * EL CONTRATO DE DATOS DE LA PLANTILLA:
 * Define qué información le devolvemos al HTML. Al tipar 'myIf' con 'MyIfTruthy<T>',
 * le aseguramos al editor que el valor que viaja dentro de la caja ya no es nulo.
 */
export interface MyIfContext<T> {
    readonly myIf: MyIfTruthy<T>; // Input as context, but guaranteed to be truthy
}

/**
 * ELIMINACIÓN DE <ng-container> MEDIANTE EL USO DE VCR:
 *
 * Antes (Enfoque de componentes con plantilla intermedia Capitulo 7):
 * Para pintar una plantilla externa, necesitábamos un archivo HTML hijo que sirviera de puente
 * utilizando un contenedor virtual y la directiva estructural 'ngTemplateOutlet':
 *
 * <!-- item-selector.html (Versión Antigua) -->
 * <div class="option-item">
 *    <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option}" />
 * </div>
 *
 * Ahora (Enfoque de Directiva Estructural Pura con VCR):
 * Al inyectar 'ViewContainerRef' (VCR), esta clase se transforma en el contenedor del DOM propiamente dicho.
 * Ya no necesitamos un archivo HTML hijo, ni etiquetas '<ng-container>', ni invocar a '*ngTemplateOutlet'.
 *
 * Beneficios Directos para el Desarrollador:
 * 1. Eliminación del HTML satélite: La directiva es 100% código TypeScript independiente.
 * 2. Rendimiento superior: Angular estampa el molde directo al DOM usando 'vcr.createEmbeddedView()',
 *    ahorrándose tener que procesar y evaluar la directiva interna '*ngTemplateOutlet'.
 */

@Directive({
    selector: '[myIf]'
})
export class MyIf<T> {

   /**
   * LAS HERRAMIENTAS DE RENDIMIENTO:
   * - 'template': Es el "plano o molde" del trozo de HTML que está envuelto por el asterisco.
   * - 'vcr' (ViewContainerRef): Es el lugar físico del DOM donde decidiremos estampar o borrar ese molde.
   */
  readonly template = inject<TemplateRef<MyIfContext<T>>>(TemplateRef)
  readonly vcr = inject(ViewContainerRef)

  /** Entrada principal: Recibe la condición o el objeto desde el componente padre */
  readonly myIf = input.required<T>();

  /**
   * EVALUADOR INTELIGENTE:
   * Transforma cualquier valor que nos pasen a un 'true' o 'false' puro de JavaScript
   * usando el operador de doble negación (!!).
   */
  readonly condition = computed(() => !!this.myIf())

  /**
   * EL COORDINADOR DEL DOM (MÉTODO CLAVE):
   * Este método se encarga de que lo que se ve en la pantalla coincida perfectamente con el estado actual.
   */
  private invalidate() {
    const cond = this.condition()
    if(cond) {
      /**
       * CASO TRUTHY (SE CUMPLE LA CONDICIÓN):
       * 1. Limpiamos el contenedor por si acaso ya había algo pintado.
       * 2. Creamos la caja de contexto y forzamos el casteo seguro 'as MyIfTruthy<T>',
       *    ya que la línea de arriba garantiza que el valor no es falso ni nulo.
       * 3. Usamos 'createEmbeddedView' para coger el molde HTML, rellenarlo con el contexto y
       * estamparlo en el DOM.
       */
      this.vcr.clear()
      const ctx: MyIfContext<T> = {
        myIf: this.myIf() as MyIfTruthy<T>
      }
      this.vcr.createEmbeddedView(this.template, ctx)
    }
    else {
      /**
       * CASO FALSY (NO SE CUMPLE LA CONDICIÓN):
       * Si hay algún elemento pintado en el contenedor (length > 0), borramos el HTML por completo
       * llamando a '.clear()'. El elemento desaparece del navegador de inmediato.
       */
      if(this.vcr.length > 0) {
        this.vcr.clear()
      }
    }
  }

  constructor() {
    /** Un efecto reactivo que vigila la condición y redibuja el DOM cada vez que esta cambie */
    effect(() => {
      this.invalidate()
    })
  }

  /**
   * EL GUARDIÁN DE TIPOS EN LAS VARIABLES 'LET-':
   * Le avisa al editor de código que las variables internas del HTML (creadas con 'as' o 'let')
   * adoptan la estructura limpia de 'MyIfContext', eliminando el tipo 'any'.
   */
  static ngTemplateContextGuard<T>(_: MyIf<T>, ctx: unknown): ctx is MyIfContext<T> {
      return true;
  }


}
