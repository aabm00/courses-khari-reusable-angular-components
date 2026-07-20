import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-expander',
  imports: [],
  templateUrl: './expander.html',
  styleUrl: './expander.scss',
})
export class ExpanderComponent {

  /** NATIVE JAVASCRIPT ENCAPSULATION
   * (ECMAScript standard - works in all frameworks like Vue/React):
   * '#' creates a true private write-signal (#isExpanded), while 'isExpanded' exposes
   * a safe, public read-only clone. This is the modern gold standard for state protection.
   */
  readonly #isExpanded = signal(false)
  readonly isExpanded = this.#isExpanded.asReadonly()
  readonly isCollapsed = computed(() => !this.#isExpanded())

  toggle() {
    this.#isExpanded.update(v => !v)
  }

  readonly header = input('')
  readonly content = input('')

}
