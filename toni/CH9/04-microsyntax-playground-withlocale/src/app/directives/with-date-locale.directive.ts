import { Directive, effect, inject, Injector, input, TemplateRef, ViewContainerRef } from "@angular/core";
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";

@Directive({
  selector: '[withDateLocale]'
})
export class WithDateLocale {

  // =================================================================================
  // INPUTS - DATOS DE ENTRADA (DESDE EL SELECT DE LA APP HACIA LA DIRECTIVA)
  // =================================================================================
  /** Recibe el código de idioma del selector (ej: 'fr-FR', 'ja-JP'). */
  readonly withDateLocale = input.required<string>();

  // =================================================================================
  // TEMPLATE - HERRAMIENTAS DE CONTROL Y CONEXIÓN CON EL DOM
  // =================================================================================
  /** El molde o plano del elemento HTML envuelto por el asterisco (el <mat-calendar>). */
  private readonly template = inject(TemplateRef);

  /**
   * ADIÓS A LAS ETIQUETAS PUENTE EN EL HTML (<ng-container>):
   * Al igual que en las directivas anteriores, inyectar 'ViewContainerRef' (VCR) hace que esta
   * clase sea el contenedor real. Nos ahorramos archivos HTML secundarios y etiquetas intermedias
   * como '<ng-container *ngTemplateOutlet="...">'. La directiva maneja el DOM de forma directa.
   */
  private readonly vcr = inject(ViewContainerRef);

  /**
   * INYECTOR PADRE DE LA APLICACIÓN:
   * Lo inyectamos para usarlo como 'padre' del nuevo inyector que crearemos en el aire.
   * Esto garantiza que el elemento conserve todos los servicios globales de la app (estilos, temas),
   * pero nos permite pisar únicamente el token del idioma.
   */
  private readonly injector = inject(Injector)

  // =================================================================================
  // EL MOTOR DE RE-RENDERIZADO Y CAMBIO DE IDIOMA EN VIVO
  // =================================================================================
  /**
   * Este método destruye la vista anterior y estampa una nueva con el idioma actualizado.
   * Modificar el idioma de un componente ya pintado (como el calendario) es muy difícil desde fuera.
   * Por eso, la mejor solución es borrarlo y volverlo a crear con la configuración de idioma correcta.
   */
  private invalidate() {
    const locale = this.withDateLocale();

    /**
     * LA CREACIÓN DEL INYECTOR EN EL AIRE:
     * Creamos un inyector hijo personalizado para este bloque de HTML.
     * 1. 'parent': Le decimos que herede todo el comportamiento del inyector general de la app.
     * 2. 'providers': Pisamos y registramos el adaptador nativo de fechas de Material y forzamos
     *    que el token 'MAT_DATE_LOCALE' adopte el valor del idioma seleccionado en el desplegable.
     */
    const viewInjector = Injector.create({
      parent: this.injector,
      providers: [
        ...provideNativeDateAdapter(),
        {
          provide: MAT_DATE_LOCALE,
          useValue: locale
        }
      ]
    });

    /** 1. Limpiamos por completo el contenedor para borrar el calendario del idioma anterior */
    this.vcr.clear();

    /**
     * 2. ESTAMPADO CON CONFIGURACIÓN FILTRADA:
     * Pasamos 'undefined' como segundo parámetro porque esta directiva NO expone variables 'let-'.
     * El truco está en el tercer parámetro: le inyectamos nuestro 'viewInjector'.
     * Cuando el '<mat-calendar>' se despierte dentro del DOM, irá a buscar el idioma a este inyector hijo,
     * leerá el idioma correcto en vivo y se configurará de forma automática (días, meses, dirección RTL/LTR).
     */
    this.vcr.createEmbeddedView(this.template, undefined, {
      injector: viewInjector
    });
  }

  constructor() {
    /** El vigilante reactivo que ejecuta 'invalidate()' cada vez que cambias el idioma en el select */
    effect(() => this.invalidate());
  }
}
