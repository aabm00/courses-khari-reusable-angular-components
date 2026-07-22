import { computed, Directive, effect, inject, input, TemplateRef, ViewContainerRef } from '@angular/core';

export interface MyIfContext<T> {
    readonly myIf: T;
}

@Directive({
    selector: '[myIf]'
})
export class MyIf<T> {

  readonly template = inject<TemplateRef<MyIfContext<T>>>(TemplateRef)
  readonly vcr = inject(ViewContainerRef)

  readonly myIf = input.required<T>();

  readonly condition = computed(() => !!this.myIf())

  private invalidate() {
    const cond = this.condition()
    if(cond) {
      this.vcr.clear()
      const ctx: MyIfContext<T> = {
        myIf: this.myIf()
      }
      this.vcr.createEmbeddedView(this.template, ctx)
    }
    else {
      if(this.vcr.length > 0) {
        this.vcr.clear()
      }
    }
  }

  constructor() {
    effect(() => {
      this.invalidate()
    })
  }

  static ngTemplateContextGuard<T>(_: MyIf<T>, ctx: unknown): ctx is MyIfContext<T> {
      return true;
  }


}
