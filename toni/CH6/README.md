
# CH6 - VIDEO 59 - 65

Este es un resumen que he hecho con GEMINI y no es exactamente lo que explica El capítulo 6 del curso. Es un resumen de cómo utilizar estos componentes de la mejor manera Para crear componentes reutilizables y flexibles. Ver los Vídeos del capítulo conjuntamente Con esta lectura para entender cómo usarlos a la mejor manera.

# Arquitectura de Interfaces en Angular: Componentes vs. `<ng-template>` + `<ng-container>`

En el desarrollo de aplicaciones modernas (SPAs), la reutilización de código es clave. Sin embargo, a medida que las aplicaciones crecen, la forma en que estructuramos y pasamos el diseño visual determina si nuestro código será limpio y mantenible o una pesadilla técnica.

Este documento explica de forma incremental cómo pasamos de estructuras rígidas a la máxima flexibilidad utilizando las herramientas avanzadas de Angular 21/22.

---

## 1. El Enfoque Tradicional: Componentes Rígidos con Inputs

La primera solución lógica que aprendemos es encapsular un diseño en un componente hijo y pasarle datos mediante la directiva `input()`.

### Ejemplo Práctico: Una tarjeta de usuario clásica
Imagina un componente hijo (`<app-user-card>`) que recibe datos fijos:

```typescript
// user-card.component.ts
@Component({
  selector: 'app-user-card',
  template: `
    <div class="p-4 border rounded-xl shadow bg-white flex items-center gap-3">
      <img [src]="avatar()" class="w-10 h-10 rounded-full" />
      <div>
        <h3 class="font-bold">{{ name() }}</h3>
        <p class="text-sm text-gray-500">{{ role() }}</p>
      </div>
    </div>
  `
})
export class UserCardComponent {
  readonly name = input.required<string>();
  readonly avatar = input.required<string>();
  readonly role = input<string>('Usuario');
}
```

### El Problema de este enfoque: "Props-Hell" (Infierno de Atributos)
Este componente funciona bien si todas las tarjetas de la aplicación son exactamente iguales. Pero, ¿qué pasa si en la pantalla de Administración necesitas que el nombre lleve un **botón de borrar al lado**, o que el rol sea una **etiqueta verde brillante** de Tailwind v4?

Para solucionarlo con componentes tradicionales, te ves obligado a modificar el componente hijo añadiendo más inputs de control:
* `[showDeleteButton]="true"`
* `[badgeColor]="'green'"`
* `[isOnline]="true"`

**Resultado:** El componente hijo se vuelve gigante, lleno de condiciones `@if` internas. El hijo está intentando adivinar todas las variaciones visuales que los padres podrían necesitar en el futuro. **El control del diseño lo tiene el hijo de forma rígida.**

---

## 2. La Solución Avanzada: Inversión de Control con `<ng-template>`

Para solucionar la rigidez, Angular introduce el concepto de **Inversión de Control Visual**. En lugar de que el hijo decida cómo pintar los datos, el hijo dice: *«Yo solo controlo la estructura y la lógica pesada; tú (el padre) pásame la plantilla con el diseño exacto que quieras pintar»*.

Para lograr esto, utilizamos tres herramientas que cooperan juntas:

1. **`<ng-template>`**: Es un bloque de HTML que nace "muerto" o invisible. No se renderiza en la pantalla por sí solo. Es simplemente una receta o plantilla guardada en memoria.
2. **`<ng-container>`**: Es una etiqueta invisible o fantasma. Sirve como el "enchufe" en el DOM. Agrupa elementos sin añadir etiquetas `<div>` reales que rompan tus grillas de CSS o Tailwind.
3. **`ngTemplateOutlet`**: Es la directiva (el cable) que toma la receta del `<ng-template>` y la inyecta viva dentro del `<ng-container>`.

---

## 3. Ventajas Exclusivas del Patrón `<ng-template>` como Input

### Ventaja A: Flexibilidad Visual Absoluta (El Padre manda)
El componente hijo nunca más tendrá que actualizarse cuando cambie el diseño de una pantalla. Si el padre quiere añadir iconos, botones o cambiar márgenes con Tailwind v4, lo hace directamente en su propio archivo HTML.

### Ventaja B: Contexto de Abajo hacia Arriba (`let-data`)
La mayor magia de este patrón es que el componente hijo puede capturar datos internos (como un índice, un estado de carga o un objeto de base de datos) y **escupirlos hacia arriba** para que la plantilla del padre los use en caliente.

### Ejemplo Maestro: Una Lista Genérica Reutilizable

#### El Componente Hijo Estructural (`list.component.ts`)
Este componente se encarga de la lógica (hacer un bucle, estilos de contenedor, etc.), pero recibe el diseño de cada fila como un input de tipo `TemplateRef`:

```typescript
@Component({
  selector: 'app-generic-list',
  imports: [NgTemplateOutlet],
  template: `
    <ul class="space-y-2">
      @for (item of dataSource(); track item.id) {
        <!-- El ng-container actúa como el hueco donde se estampará la plantilla -->
        <ng-container 
          [ngTemplateOutlet]="rowTemplate()" 
          [ngTemplateOutletContext]="{ $implicit: item }">
        </ng-container>
      }
    </ul>
  `
})
export class GenericListComponent {
  readonly dataSource = input.required<any[]>();
  // Recibe la plantilla muerta desde el padre
  readonly rowTemplate = input.required<TemplateRef<any>>();
}
```

#### El Componente Padre Declarativo (`app.html`)
El padre crea el `<ng-template>`, define el diseño exacto usando Tailwind v4 y extrae el usuario interno usando la sintaxis `let-user`:

```html
<app-generic-list [dataSource]="usuarios" [rowTemplate]="disenoFila">
  
  <!-- Definimos la receta visual aquí fuera. No se pinta aquí, se guarda en #disenoFila -->
  <ng-template #disenoFila let-user>
    <li class="p-3 bg-surface-50 rounded-lg flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500"></span>
        <p class="font-medium text-primary-600">{{ user.name }}</p>
      </div>
      <!-- ¡Podemos meter botones personalizados sin tocar el componente lista! -->
      <button class="text-red-500 hover:underline text-xs">Eliminar</button>
    </li>
  </ng-template>

</app-generic-list>
```

---

## 4. Resumen Comparativo: ¿Cuándo usar cada uno?

| Criterio | Componente con Inputs tradicionales | `<ng-template>` como Input |
| :--- | :--- | :--- |
| **Control del HTML** | Lo define el Hijo (Rígido) | Lo define el Padre (Flexible) |
| **Modificaciones** | Requiere añadir más propiedades `input()` continuamente | Cero cambios en el hijo; el padre cambia su HTML libremente |
| **Inyección de datos** | De Padre a Hijo únicamente | Bidireccional (El hijo inyecta contexto al diseño del padre) |
| **Uso Ideal** | Átomos fijos del sistema de diseño (Botones, Chips, selectores) | Elementos estructurales y repetitivos (Tablas, Listas, Grillas, Layouts) |

---

## 5. El Equivalente en Vue 3: Scoped Slots

En **Vue 3 (Composition API)** no existe un sistema para declarar fragmentos de plantilla sueltos en variables (`ng-template`), porque Vue resuelve este problema de raíz de una forma mucho más compacta utilizando **Scoped Slots (Ranuras con alcance)**.

La filosofía es idéntica: el componente hijo de Vue define el esqueleto mediante `<slot>` y le envía los datos internos al padre usando atributos dinámicos (`:item="item"`).

### El mismo ejemplo de la Lista en Vue 3:

#### Componente Hijo (`GenericList.vue`)
```html
<template>
  <ul class="space-y-2">
    <li v-for="item in dataSource" :key="item.id">
      <!-- El <slot> es el ng-container. Pasamos el item hacia arriba como propiedad -->
      <slot name="row" :user="item"></slot>
    </li>
  </ul>
</template>

<script setup>
defineProps(['dataSource'])
</script>
```

#### Uso en el Componente Padre (`App.vue`)
El padre abre la etiqueta `<template #row>`, recibe el usuario usando la sintaxis `{ user }` y maqueta el diseño libremente en el mismo lugar:

```html
<template>
  <GenericList :dataSource="usuarios">
    <!-- #row es el ng-template, y { user } es el let-user de Angular -->
    <template #row="{ user }">
      <div class="p-3 bg-surface-50 rounded-lg flex items-center justify-between">
        <p class="font-medium text-primary-600">{{ user.name }}</p>
        <button class="text-red-500 text-xs">Eliminar</button>
      </div>
    </template>
  </GenericList>
</template>
```

## 6. Súper-Poderes: Combinando `<ng-template>` con Directivas Custom (Explicado paso a paso)

Para quitar la "magia" de Angular, debemos entender que el asterisco (`*`) es un **atajo de teclado para el compilador**. Cuando pones un asterisco, le ordenas a Angular que cree un `<ng-template>` en memoria de forma automática.

Aquí tienes el flujo real de dónde salen las cosas:

### Paso 1: La Directiva de Control (`if-role.directive.ts`)
Esta directiva no añade estilos; añade o destruye HTML. Para ello, inyecta dos herramientas nativas de Angular:
1. `TemplateRef`: La receta de cocina (el contenido del `<ng-template>`).
2. `ViewContainerRef`: El enchufe físico en la pared (el `<ng-container>`).

```typescript
import { Directive, inject, input, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Servicio que guarda el rol actual

@Directive({
  selector: '[ifRole]',
  standalone: true
})
export class IfRoleDirective {
  // Recibe el rol requerido desde el HTML (ej. 'admin')
  readonly ifRole = input.required<string>();

  // Angular inyecta automáticamente la plantilla y el contenedor donde se aplica
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);

  constructor() {
    effect(() => {
      // 1. Limpiamos el enchufe (borramos lo que hubiera antes)
      this.viewContainer.clear();

      // 2. Si el rol del usuario coincide con el requerido, inyectamos la plantilla viva en el DOM
      if (this.authService.userRole() === this.ifRole()) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
```

### Paso 2: El código que tú escribes en el HTML (`app.html`)
Tú escribes esto usando el asterisco corto:

```html
<div class="p-6 bg-white shadow rounded-xl">
  <!-- El asterisco '*ifRole' le avisa a Angular que este botón es una plantilla condicional -->
  <button *ifRole="'admin'" class="bg-red-500 text-white px-3 py-1 rounded">
    Borrar Perfil (Solo Admin)
  </button>
</div>
```

### Paso 3: De dónde salen las cosas (Lo que hace Angular por dentro en realidad)
Cuando pulsas guardar, el compilador de Angular transforma el código del **Paso 2** y lo reescribe físicamente en la memoria del navegador de esta forma extendida. **Aquí es donde aparecen el container y el template explícitos:**

```html
<div class="p-6 bg-white shadow rounded-xl">

  <!-- 1. EL ENCHUFE: La directiva se acopla a un contenedor invisible -->
  <ng-container [ifRole]="'admin'">
    
    <!-- 2. LA RECETA: El botón queda guardado dentro de este ng-template "muerto" -->
    <ng-template>
      <button class="bg-red-500 text-white px-3 py-1 rounded">
        Borrar Perfil (Solo Admin)
      </button>
    </ng-template>

  </ng-container>

</div>
```
* **¿De dónde sale el `<ng-template>`?** Lo crea el asterisco `*ifRole` para envolver al botón y protegerlo.
* **¿Cómo se conecta con la directiva?** La directiva del Paso 1 toma ese `<ng-template>` mediante `inject(TemplateRef)` y, si el usuario es administrador, lo inyecta vivo dentro del `<ng-container>`. Si no es administrador, el `<ng-template>` se queda flotando en memoria y el botón nunca llega al DOM del navegador.

---

## 7. El Equivalente en Vue 3: Estructuras Condicionales con Slots

En Vue 3 no existen las directivas estructurales (las directivas de Vue no pueden crear o destruir elementos usando `TemplateRef`). Para lograr exactamente el mismo nivel de seguridad y limpieza, Vue utiliza un **Componente Envoltorio Estructural** combinando propiedades (*props*) y ranuras (*slots*).

Así es como se desglosa el mecanismo en Vue 3 sin magia:

### Paso 1: El Componente de Control (`IfRole.vue`)
Este componente actúa exactamente como el `<ng-container>` de Angular: es un elemento invisible que decide si muestra o no lo que tiene dentro.

```html
<!-- IfRole.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth' // Tienda global de usuario

// Recibe el rol requerido como un prop string
const props = defineProps<{ role: string }>()
const auth = useAuthStore()

// Comprobación reactiva
const hasPermission = computed(() => auth.userRole === props.role)
</script>

<template>
  <!-- 
    El <slot /> es el equivalente al <ng-template>.
    Si 'hasPermission' es verdadero, el motor de Vue dibuja el contenido del slot.
    Si es falso, 'v-if' destruye el bloque completo y no genera ningún HTML.
  -->
  <slot v-if="hasPermission" />
</template>
```

### Paso 2: Cómo lo usas en tu Vista Principal (`App.vue`)
En tu HTML de Vue, importas el componente de control y envuelves el botón que quieres proteger:

```html
<!-- App.vue -->
<template>
  <div class="p-6 bg-white shadow rounded-xl">
    
    <!-- Pasamos el rol 'admin' al componente hijo -->
    <IfRole role="admin">
      <!-- Este botón es el contenido que cae dentro del <slot /> -->
      <button class="bg-red-500 text-white px-3 py-1 rounded">
        Borrar Perfil (Solo Admin)
      </button>
    </IfRole>

  </div>
</template>
```

### Paso 3: El Mecanismo Oculto en Vue 3
A diferencia de Angular, Vue no reescribe tu HTML con otras etiquetas. Lo que hace el motor de Vue (Virtual DOM) por detrás es una **evaluación previa en JavaScript**:

1. Vue lee la vista del padre (`App.vue`). Antes de pintar el botón, salta al componente `<IfRole>`.
2. Ejecuta la función del paso 1: ¿El usuario es administrador?
   * **Si es SI**: El compilador de Vue toma el HTML del botón y lo estampa directamente en el DOM real.
   * **Si es NO**: La propiedad `v-if` del `<slot>` da falso. Vue ignora por completo el botón, haciendo que no consuma memoria ni aparezca en el inspector de elementos (F12) del usuario.


Aquí tienes el contenido completo, perfectamente estructurado en formato Markdown, listo para que lo copies y lo guardes en tu disco duro (ideal para visualizarlo en Obsidian).
Explica de forma muy sencilla, incremental y con ejemplos cotidianos por qué existen ambas herramientas y cuándo debes elegir cada una.


# Slots (`ng-content`) vs. Plantillas (`ng-template`): ¿Cuál es la diferencia y cuándo usar cada uno?

Tanto los **Slots** como las **Templates** son herramientas de **Inversión de Control**. Sirven para lo mismo en apariencia: permitir que un componente padre inyecte código HTML dentro de un componente hijo.

Sin embargo, funcionan de manera radicalmente distinta por debajo. La regla de oro para diferenciarlos es:

* **Los Slots** sirven para pasar contenido **fijo y único** (se dibuja una sola vez).
* **Las Templates** sirven para pasar una **receta repetible** (se puede dibujar cero, una o un millón de veces).

---

## 1. La analogía de la vida real* 

* **Un Slot es como un "Portavasos" en tu coche**: El hueco está ahí de forma fija. Tú puedes meter un vaso de café o una lata de refresco desde fuera (el padre decide el contenido), pero en ese hueco solo cabe **un único objeto real a la vez**.
* **Una Template es como un "Molde para Galletas"**: No le estás pasando al componente una galleta ya horneada; le estás pasando el molde. El componente hijo puede usar ese molde para fabricar **10, 100 o ninguna galleta**, dependiendo de cuánta hambre tenga (la lógica interna del hijo).

---

## 2. Diferencias Técnicas Fundamentales

### A. El número de renderizados (Multiplicación)* 

* **Slots (`ng-content` / Vue Slots)**: El contenido se procesa en el padre y viaja "vivo" al hijo. Si metes un `<slot>` dentro de un bucle `for`, la aplicación fallará o ignorará la repetición, porque un nodo físico del DOM no puede duplicarse a sí mismo en múltiples sitios a la vez.
* **Templates (`ng-template`)**: El contenido viaja "dormido". El componente hijo puede usar ese bloque como una fábrica, clonándolo y estampándolo en el HTML tantas veces como elementos existan en un array.

### B. El flujo de los datos (Contexto)* 

* **Slots**: El contenido se evalúa en el padre. El hijo no puede enviarle datos "en caliente" al HTML que ha recibido.
* **Templates (`let-data`)**: Permiten comunicación de abajo hacia arriba. El hijo puede inyectarle información interna del sistema a la plantilla del padre antes de dibujarla (por ejemplo, decirle qué color o qué usuario se está procesando en esa línea exacta).

### C. Rendimiento (Renderizado Perezoso o Lazy)* 

* **Slots**: Aunque el contenido esté oculto (por ejemplo, dentro de un acordeón cerrado), el navegador **ya ha procesado y ejecutado todo su código HTML de fondo**.
* **Templates**: Al estar dormidas, **no consumen memoria ni procesan nada** hasta que el hijo decide despertarlas, optimizando drásticamente el rendimiento de la aplicación.

---
## 3. Ejemplo Práctico: Cuándo usar cada uno

### Caso de Uso 1: Un componente "Tarjeta" (Layout Fijo) ➡️ Usar SLOTS

Una tarjeta de interfaz (`<app-card>`) tiene una estructura fija (un título y un cuerpo), pero el contenido de dentro cambia. Se dibuja **una sola vez**.

* **Código del Hijo (`card.component.html`)**:

```html
<div class="border p-4 rounded-xl shadow bg-white">
  <!-- Dejamos los huecos fijos -->
  <div class="font-bold border-b pb-2">
    <ng-content select="[card-title]" />
  </div>

  <div class="pt-2">
    <ng-content />
  </div>
</div>
```
* **Uso en el Padre (`app.html`)**:

```html
<app-card>
  <h2 card-title>Mi Perfil</h2>
  <p>Este es el texto del cuerpo. Se renderiza una única vez directamente.</p>
</app-card>
```

### Caso de Uso 2: Un "Selector de Ítems" (Bucle con Contexto) ➡️ Usar TEMPLATES

Imagina un componente que muestra una lista de opciones, pero quieres que el padre decida el diseño visual de cada fila basándose en el dato de esa fila. Se dibuja **muchas veces**.

* **Código del Hijo (`item-selector.component.html`)**:

```html
<div class="flex flex-col gap-2">
  @for (option of options(); track option) {
    <div class="p-2 border rounded">
      <!-- El hijo repite la plantilla del padre y le pasa el dato actual (\$implicit) -->
      <ng-container 
        [ngTemplateOutlet]="itemTemplate()" 
        [ngTemplateOutletContext]="{ \$implicit: option }">
      </ng-container>
    </div>
  }
</div>
```
* **Uso en el Padre (`app.html`)**:

```html
<app-item-selector [options]="['Morado', 'Verde', 'Cian']" [itemTemplate]="disenoColor">
  
  <!-- Pasamos la receta. El hijo la repetirá 3 veces e inyectará el texto en 'let-color' -->
  <ng-template #disenoColor let-color>
    <span [style.color]="color" class="font-bold">
      🎨 Color seleccionado: {{ color }}
    </span>
  </ng-template>

</app-item-selector>
```
---

## 4. Resumen Resumido: Guía de Decisión

| ¿Qué estás construyendo? | Herramienta Ideal | Razón Principal |
| :--- | :--- | :--- |
| Botones, Modales, Barras de navegación, Tarjetas. | **Slots (`ng-content`)** | El contenido es único, estático y estructural. |
| Tablas, Listas dinámicas, Grillas, Carruseles. | **Templates (`ng-template`)** | Necesitas multiplicar el HTML para cada fila y pasar el contexto (`let-item`). |
| Secciones pesadas (Menús desplegables, pestañas ocultas). | **Templates (`ng-template`)** | Evita que el navegador procese el HTML hasta que el usuario haga clic (Rendimiento). |

---

## 5. El mapa en Vue 3 (Equivalencia rápida)

Si vienes de Vue 3, no tienes que aprender conceptos nuevos; ya utilizas esta misma lógica bajo otros nombres:

* **El equivalente de los Slots (`ng-content`)** son los **Slots normales o nombrados** (`<slot />` / `<slot name="title" />`).
* **El equivalente de las Templates (`ng-template`)** son los **Scoped Slots (Slots con alcance)** (`<slot :item="option" />`), donde el hijo le devuelve el contexto al padre mediante atributos.

## 6. La Equivalencia en Vue 3 (Explicado sin Magia)

Si vienes de **Vue 3**, el sistema de plantillas dinámicas no requiere aprender un concepto nuevo; es exactamente el mismo patrón que ya utilizas bajo el nombre de **Scoped Slots (Slots con alcance)**. 

La filosofía de ambos frameworks es idéntica en este punto: el componente hijo de Vue define el "enchufe" mediante `<slot>` y le inyecta los datos internos al diseño del padre usando atributos dinámicos (`:color="option"`).

### El mismo ejemplo del Selector de Colores en Vue 3:

#### Paso 1: El Componente Hijo (`ItemSelector.vue`)
Este componente se encarga de la lógica pesada (hacer el bucle `v-for`), pero en lugar de pintar el texto a lo bruto, le pasa la batuta al padre. Envía el color de cada iteración hacia arriba mediante un atributo en el `<slot>`:

``` html
<!-- ItemSelector.vue (El componente hijo) -->
<script setup lang="ts">
// Recibe la lista de opciones desde el padre
defineProps<{ options: string[] }>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-for="option in options" :key="option" class="p-2 border rounded">
      
      <!-- 
        El <slot> es el ng-container + ngTemplateOutlet de Angular.
        Pasamos la variable 'option' hacia arriba con el nombre ':color'
      -->
      <slot name="disenoColor" :color="option"></slot>
      
    </div>
  </div>
</template>
```

#### Paso 2: El Componente Padre (`App.vue`)
El padre abre la etiqueta `<template #disenoColor>`, recibe el color inyectado desde abajo usando la sintaxis de desestructuración `{ color }` y aplica el diseño libremente con sus clases de **Tailwind v4**:

```html
<!-- App.vue (El componente padre) -->
<script setup lang="ts">
import { ref } from 'vue'
import ItemSelector from './ItemSelector.vue'

const possibleColors = ref(['Morado', 'Verde', 'Cian'])
</script>

<template>
  <ItemSelector :options="possibleColors">
    
    <!-- 
      '#disenoColor' es el '#disenoColor' (ng-template) de Angular.
      '{ color }' es el 'let-color' de Angular (recibe el dato de abajo).
    -->
    <template #disenoColor="{ color }">
      <span :style="{ color: color }" class="font-bold">
        🎨 Color seleccionado: {{ color }}
      </span>
    </template>
    
  </ItemSelector>
</template>
```

### 📊 Tabla de Equivalencias Directas:

| Concepto Arquitectónico | En Angular 21/22 | En Vue 3 (Composition API) |
| :--- | :--- | :--- |
| **La Receta Dormida** | `<ng-template #id>` | `<template #id>` o `<template v-slot:id>` |
| **El Enchufe / Contenedor** | `<ng-container [ngTemplateOutlet]="...">` | `<slot name="id" />` |
| **Inyección de datos (Abajo ➡️ Arriba)** | `let-color="data"` | `#disenoColor="{ color }"` |
| **Rendimiento "Lazy"** | La plantilla no se evalúa hasta el `createEmbeddedView` | El slot no se compila en el DOM virtual si la condición es falsa |

