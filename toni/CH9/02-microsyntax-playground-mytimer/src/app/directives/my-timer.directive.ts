import { computed, Directive, effect, inject, input, signal, Signal, TemplateRef, ViewContainerRef } from "@angular/core";

export type TimeState = 'running' | 'done';

/**
 * CONTRATO DE VARIABLES QUE EXPORTAMOS AL HTML:
 * Todo lo que el padre declare con 'let-variable' se lee de esta interfaz.
 * Obligatoriamente usamos 'Signal' para que los cambios se refresquen en vivo en la pantalla.
 */
export interface MyTimerContext {
    readonly value: Signal<number>;       /** Cuenta actual (1, 2, 3...) */
    readonly state: Signal<TimeState>;    /** ¿Running o done? */
    // Inputs como contexto
    readonly myTimer: Signal<number>;     /** El intervalo en milisegundos */
    readonly myTimerFrom: Signal<number>; /** El número inicial de la cuenta */
}

@Directive({
    selector: '[myTimer]'
})
export class MyTimer {

    // =================================================================================
    // CONFIGURACIÓN DE ENTRADAS (DESDE EL HTML PADRE HACIA LA DIRECTIVA)
    // =================================================================================
    readonly myTimer = input.required<number>(); // Tiempo entre ticks
    readonly myTimerFrom = input(0);             // Punto de inicio
    readonly myTimerTo = input(Infinity);        // Límite máximo
    readonly myTimerStep = input(1);             // Cuánto sumamos en cada tick

    // =================================================================================
    // CONTEXTO - MANEJO DE ESTADO REVOLUCIONARIO (CERO ESTADOS REDUNDANTES)
    // =================================================================================

    /** La única señal que muta: el número actual. Empezamos en 0 de forma provisional. */
    private readonly value = signal(0)
    /**
     * SEÑAL DERIVADA: No guardamos el estado 'done' en una variable separada.
     * Evaluamos en tiempo real si el valor actual ya alcanzó o superó el límite 'to'.
     */
    private readonly state = computed(()=> this.value() >= this.myTimerTo() ? 'done' : 'running')

    /**
     * ELIMINACIÓN DE <ng-container> POR INFRAESTRUCTURA (VCR):
     * Al inyectar directamente 'TemplateRef' (el molde HTML) y 'ViewContainerRef' (el contenedor DOM),
     * esta directiva toma las riendas del DOM. No necesita un archivo HTML hijo secundario ni usar
     * un '<ng-container *ngTemplateOutlet="...">'. Se dibuja sola donde se ponga el asterisco (*myTimer).
     */
    readonly template = inject<TemplateRef<MyTimerContext>>(TemplateRef)
    readonly vcr = inject(ViewContainerRef)


    constructor() {
      /**
       * 1. PREPARACIÓN DEL CONTEXTO:
       * Empaquetamos las señales. Usamos '.asReadonly()' en la cuenta para asegurar que el HTML
       * exterior solo pueda consumirla, impidiendo que la altere por accidente.
       */
      const ctx: MyTimerContext = {
        value: this.value.asReadonly(),
        state: this.state,
        myTimer: this.myTimer,
        myTimerFrom: this.myTimerFrom
      }

      /**
       * 2. CREACIÓN ÚNICA DE LA VISTA:
       * El temporizador solo se estampa una vez en el DOM al arrancar. No se borra ni se recrea.
       * Lo único dinámico que cambia a lo largo de los segundos son los valores internos de las señales.
       */
      this.vcr.createEmbeddedView(this.template, ctx)

      /**
       * 3. EL MOTOR REACTIVO DEL RELOJ (EFFECT + ONCLEANUP):
       * Este efecto está pendiente de las señales de entrada (intervalo, step, etc.). Si tocas un botón
       * en la pantalla que altere el 'step' o el 'interval', Angular ejecuta este bloque automáticamente.
       */
      effect((onCleanup) => {
        // Capturamos el estado actual de las configuraciones
        const interval = this.myTimer()
        const from = this.myTimerFrom()
        const to = this.myTimerTo()
        const step = this.myTimerStep()

        // Reseteamos el reloj al valor de inicio configurado
        this.value.set(from)

        // Disparamos el reloj nativo de JavaScript
        const id = setInterval(()=> {
          // Incrementamos la cuenta asegurando que nunca sobrepase el límite con 'Math.min'
          this.value.update(v => Math.min(v + step, to))
          // Si alcanzamos el tope, limpiamos el intervalo inmediatamente para no gastar procesador
          if(this.value() >= to) {
            clearInterval(id)
          }
        }, interval)

        /**
         * DESTRUCCIÓN DE RELOJES "ZOMBI":
         * ¿Qué ocurre si cambias el 'step' de 1 a 2 mientras el reloj de 2 segundos está contando?
         * Si no hiciéramos nada, el 'setInterval' anterior se quedaría corriendo en la memoria del navegador
         * en paralelo al nuevo. 'onCleanup' se ejecuta JUSTO ANTES de reiniciar este efecto.
         * Borramos el temporizador anterior garantizando que solo exista UN reloj vivo en segundo plano.
         */
        onCleanup(() => clearInterval(id))
      })
    }

    /** GUARDIÁN DE TIPOS: Activa el autocompletado inteligente para 'v()' y 's()' en el HTML del padre */
    static ngTemplateContextGuard(_: MyTimer, ctx: unknown): ctx is MyTimerContext {
        return true;
    }

}
