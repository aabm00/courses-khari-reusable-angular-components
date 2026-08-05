import { computed, Directive, effect, inject, input, signal, Signal, TemplateRef, ViewContainerRef } from "@angular/core";

/**
 * EL CONTRATO DE DATOS PARA LAS VARIABLES DE LA VISTA:
 * Todo lo que el HTML exterior intente capturar con 'let-' se extrae de esta interfaz.
 * Envolvemos las propiedades en 'Signal' para que cada fila se entere y se actualice sola.
 */
export interface MyRepeatContext {
    readonly $implicit: Signal<number>; /** El número calculado que le toca mostrar a este ítem */
    readonly index: Signal<number>;     /** La posición real dentro de la lista (0, 1, 2...) */
    readonly first: Signal<boolean>;    /** Indica si es el primer elemento del listado */
    readonly last: Signal<boolean>;     /** Indica si es el último elemento del listado */
    readonly myRepeat: Signal<number>;  /** La cantidad total solicitada (sirve para el alias 'as c') */
}

@Directive({
    selector: '[myRepeat]'
})
export class MyRepeat {
    // =================================================================================
    // DATOS DE ENTRADA (DESDE EL PANEL CONTROLADOR HACIA LA DIRECTIVA)
    // =================================================================================
    readonly myRepeat = input.required<number>();  /** Cantidad total de filas a dibujar */
    readonly myRepeatStart = input(0);             /** Número desde el que arranca la secuencia */
    readonly myRepeatSkip = input(1);              /** Cuánto sumamos de una fila a la siguiente */

    /**
     * ADIÓS AL CONTENEDOR EN EL HTML (<ng-container>):
     * Al inyectar directamente 'TemplateRef' (el molde HTML) y 'ViewContainerRef' (VCR),
     * la directiva se convierte en su propio administrador del DOM.
     * Ya no necesitamos un archivo HTML secundario que use un '<ng-container *ngTemplateOutlet="...">'.
     * Angular estampa los elementos directamente en el lugar exacto del asterisco (*myRepeat).
     */
    readonly template = inject<TemplateRef<MyRepeatContext>>(TemplateRef);
    readonly vcr = inject(ViewContainerRef);

    /**
     * LA ESTRUCTURA QUIRÚRGICA DEL DOM (MÉTODO CLAVE):
     * En lugar de borrar toda la pantalla con un '.clear()' y volver a crear todos los elementos
     * desde cero (lo cual destruiría nodos y ralentizaría la app), hacemos cambios incrementales
     * tocando únicamente los extremos de la lista.
     */
    private invalidate() {
      const count = this.myRepeat()

      // ---------------------------------------------------------------------------------
      // CASO 1: SI EL CONTADOR BAJA -> RECORTAMOS LA COLA (ELIMINACIÓN EFICIENTE)
      // ---------------------------------------------------------------------------------
      // Si en pantalla hay más filas de las que el usuario pide ahora, entramos en este bucle
      // y borramos los elementos sobrantes desde el final. Las primeras filas no se tocan.
      while (this.vcr.length > count) {
        this.vcr.remove(this.vcr.length - 1)
      }

      // ---------------------------------------------------------------------------------
      // CASO 2: SI EL CONTADOR SUBE -> COSEMOS FILAS NUEVAS AL FINAL (INCREMENTO EFICIENTE)
      // ---------------------------------------------------------------------------------
      // Si en pantalla faltan filas para llegar al número deseado, entramos en este bucle.
      // Creamos y estampamos ÚNICAMENTE los elementos nuevos al final de la lista.
      while (this.vcr.length < count) {
        /**
         * ASIGNACIÓN DE INDICE ESTABLE:
         * Guardamos la posición actual del contenedor. Al usar '.asReadonly()', protegemos la señal.
         * Como esta directiva no reordena la lista, el índice nunca cambiará para esta fila una vez creada.
         */
        const index = signal(this.vcr.length).asReadonly()
        /**
         * SEÑALES DERIVADAS INTELIGENTES (CERO VALORES DUPLICADOS):
         * No guardamos manualmente 'first' o 'last' en variables fijas. Las calculamos en vivo:
         * - 'first': Es true si el índice es 0.
         * - 'last': Es true si el índice coincide con el total actual de la lista menos 1.
         * ¡MAGIA!: Como 'last' depende de 'this.myRepeat()', si el contador cambia en el futuro,
         * las filas que ya estaban dibujadas recomputarán solas su estado 'last' sin destruirse.
         */
        const first = computed(() => index() === 0 )
        const last = computed(() => index() === (this.myRepeat() -1) )
        /** Reutilizamos la señal del input para alimentar de forma reactiva el alias "as c" */
        const myRepeat = this.myRepeat;
        /**
         * FÓRMULA ARITMÉTICA DEL VALOR INTERNO:
         * Multiplicamos el índice por el salto ('skip') y le sumamos el punto de partida ('start').
         * Si el usuario altera el botón de 'Start' o 'Skip' en la barra de herramientas, esta ecuación
         * actualizará los textos de todas las filas al instante sin reconstruir el DOM.
         */
        const value = computed(() => this.myRepeatStart() + index() * this.myRepeatSkip())

        /** Estampamos el molde HTML pasándole su respectivo paquete de datos individuales */
        this.vcr.createEmbeddedView(this.template, {
          $implicit: value,
          index,
          first,
          last,
          myRepeat
        })
      }
    }


    constructor() {
        /** El vigilante automático que reacciona de inmediato ante cualquier mutación en los botones del panel */
        effect(() => {
          this.invalidate()
        })
    }

    /** GUARDIÁN DE CONTEXTO: Conecta los tipos para que el HTML reconozca que las variables son Signals */
    static ngTemplateContextGuard(_: MyRepeat, ctx: unknown): ctx is MyRepeatContext {
        return true;
    }
}
