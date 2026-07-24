import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MyLink, provideMyLinkActiveClass } from "./directives/my-link.directive";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  // =========================================================================================
  // CONFIGURACIÓN DINÁMICA MEDIANTE INYECTOR JERÁRQUICO
  // =========================================================================================
  // ¿QUÉ ES REALMENTE UN "PROVIDER" Y QUÉ ACEPTA ESTE ARRAY?
  // El array 'providers' NO acepta strings sueltos, ni módulos, ni funciones directas. Solo
  // acepta clases decoradas con '@Injectable' o, en su defecto, objetos de configuración que
  // cumplan estrictamente con la interfaz 'Provider' de Angular (ej: { provide: Token, useValue: X }).
  //
  // ¿Por qué ponemos 'provideMyLinkActiveClass('chosen')'?
  // Porque esa función es un "helper" que se ejecuta inmediatamente y DEVOLVERÁ exactamente el
  // objeto de configuración que Angular exige. Al registrarlo aquí, alteramos el comportamiento
  // de TODAS las directivas 'myLink' que existan dentro de este componente y de sus hijos.
  //
  // Ventaja radical: Cambiamos el comportamiento de todos los enlaces de la sección sin añadir
  // propiedades en el HTML (<a myLink="...">). El HTML permanece limpio y libre de "Props-Hell".
  // =========================================================================================
  providers: [
    provideMyLinkActiveClass('chosen')
  ]
})
export class App {
  protected readonly title = signal('my-link-directive');
}
