import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  inputBinding,
  signal,
  twoWayBinding,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './models/product.model';
import { PRODUCTS } from './data/products.data';
import { VIEW_OPTIONS } from './tokens/view-option.model';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { SelectOption } from './models/select-option.model';
import { GridViewComponent } from './views/grid-view/grid-view';
import { VIEW_ACTIONS, ViewActions } from './tokens/view-actions.token';
import { VIEW_PICKER } from './tokens/view-picker.token';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ProductDetailComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Herramientas del núcleo de Angular y tokens de configuración */
  readonly injector = inject(Injector);
  private readonly viewOptions = inject(VIEW_OPTIONS);
  private readonly pickerType = inject(VIEW_PICKER);

  /**
   * LOCALIZADOR DEL PUNTO DE ANCLAJE (#pickerAnchor):
   * Buscamos la referencia en el H1 de la cabecera. Con '{read: ViewContainerRef}', le pedimos
   * a Angular el contenedor de vistas para poder instanciar componentes por código en esa posición.
   */
  readonly pickerVcr = viewChild.required('pickerAnchor', {read: ViewContainerRef});

  /** Extraemos de la configuración un listado simple de opciones legibles para los pickers */
  readonly views = computed<SelectOption[]>(() => this.viewOptions.map(o => ({
    label: o.label,
    value: o.value
  })));

  /** Almacena el ID de la vista activa en cada momento (grid, list, cards) */
  readonly selectedView = signal<string>('grid');

  /**
   * RESOLUTOR DINÁMICO DE CLASES DE VISTAS (FASE 1):
   * Mira el ID guardado en 'selectedView()'. Va a la lista de opciones fijas e infiere la clase
   * real de TypeScript del componente (ej: GridViewComponent). Si falla, aplica un fallback seguro.
   */
  readonly activeViewComponent = computed(() => {
    const found = this.viewOptions.find(v => v.value === this.selectedView());
    return found?.component ?? GridViewComponent;
  });

  /** Envuelve de forma reactiva la lista de productos requerida por los inputs de las vistas */
  readonly activeViewInputs = computed(() => ({
    items: this.products()
  }));

  // =================================================================================
  // FASE 2: EL PUENTE DE ACCIONES EN SUSTITUCIÓN DE OUTPUTS
  // =================================================================================
  /** Definimos el objeto que procesará las llamadas cuando se haga click en un producto de la vista dinámica */
  readonly ViewActions: ViewActions = {
    onItemSelect: (product) => this.selectedProduct.set(product)
  };

  /**
   * Fabricamos un inyector en caliente. Le metemos nuestras 'ViewActions'.
   * Al enviarlo a 'ngComponentOutlet', la vista dinámica podrá inyectar este token y llamar a sus métodos.
   */
  readonly viewInjector = Injector.create({
    parent: this.injector,
    providers: [
      {provide: VIEW_ACTIONS, useValue: this.ViewActions}
    ]
  });

  readonly products = signal(PRODUCTS);
  readonly selectedProduct = signal<Product | null>(null);

  constructor() {
    /**
     * FASE 4: ENLAZADO E INSTANCIACIÓN 100% POR CÓDIGO
     * Levantamos de forma manual el selector de vistas configurado tan pronto como el DOM esté listo.
     */
    effect(() => {
      /**
       * Llamamos a '.createComponent()' pasándole la clase inyectada (TabPicker o SelectPicker).
       * Como el componente nace en TypeScript puro, realizamos los enlaces usando ayudantes modernos:
       * - 'inputBinding': Inyecta de forma reactiva la señal de opciones al input del selector.
       * - 'twoWayBinding': Conecta de doble vía la señal 'selectedView' con el modelo del selector,
       *   logrando que los cambios de pestañas alteren el estado general de la aplicación al instante.
       */
      this.pickerVcr().createComponent(this.pickerType, {
        bindings: [
          inputBinding('options', this.views),
          twoWayBinding('value', this.selectedView)
        ]
      });
    });
  }
}
