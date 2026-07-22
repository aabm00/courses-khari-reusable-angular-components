import { Directive, input } from "@angular/core";

export interface MyIfContext<T> {
    readonly myIf: T;
}

@Directive({
    selector: '[myIf]'
})
export class MyIf<T> {
    readonly myIf = input.required<T>();

    static ngTemplateContextGuard<T>(_: MyIf<T>, ctx: unknown): ctx is MyIfContext<T> {
        return true;
    }

}