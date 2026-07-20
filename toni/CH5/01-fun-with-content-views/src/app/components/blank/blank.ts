import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-blank',
  imports: [],
  templateUrl: './blank.html',
  styleUrl: './blank.scss',
  // encapsulation: ViewEncapsulation.None // Makes the styling in this component global. Be careful about it.
})
export class Blank {

}

/**
 * VIEW ENCAPSULATION MODES EXPLAINED:
 *
 * 1. Emulated (Default): Angular isolates component styles by attaching unique host/content
 *    attributes (e.g., _ngcontent-c123). Styles in 'blank.scss' cannot leak outside.
 *
 * 2. None: Removes all isolation barriers. Any style defined in 'blank.scss' behaves like
 *    a global stylesheet, affecting all components throughout the entire application.
 *
 * 3. ShadowDom: Uses the browser's native Shadow DOM API to isolate styles and markup.
 *    Global styles (like Tailwind utilities) cannot enter this component unless explicitly imported.
 */

