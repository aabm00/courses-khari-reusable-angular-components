import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MyLink, provideMyLinkActiveClass } from "./directives/my-link.directive";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  /**
   * =========================================================================================
   * CONFIGURACIÓN DINÁMICA MEDIANTE INYECTOR JERÁRQUICO
   * =========================================================================================
   * ¿QUÉ ACEPTA ESTE ARRAY 'PROVIDERS'?
   * No acepta strings sueltos ni funciones directas. Solo admite clases '@Injectable' o
   * objetos que cumplan la interfaz 'Provider' (ej: { provide: Token, useValue: X }).
   *
   * ¿POR QUÉ INVOCAMOS 'provideMyLinkActiveClass('chosen')'?
   * Porque esta función se ejecuta inmediatamente y devuelve el objeto de configuración
   * exacto que Angular exige. Al registrarlo aquí, alteramos el comportamiento de todas
   * las directivas 'myLink' de este componente y de sus componentes hijos.
   *
   * VENTAJA ARQUITECTÓNICA:
   * Cambiamos el estilo activo de todos los enlaces de la sección desde un único punto.
   * El HTML permanece limpio, legible y libre de propiedades repetitivas ("Props-Hell").
   * =========================================================================================
   */
  providers: [
    provideMyLinkActiveClass('chosen')
  ]
})
export class App {
  protected readonly title = signal('my-link-directive');
}
