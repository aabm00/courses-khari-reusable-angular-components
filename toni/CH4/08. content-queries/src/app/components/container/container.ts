import { Component, contentChild, contentChildren, effect, ElementRef } from '@angular/core';
import { Item } from '../item/item';

@Component({
  selector: 'app-container',
  imports: [],
  templateUrl: './container.html',
  styleUrl: './container.scss',
})
export class Container {
  readonly items = contentChildren(Item, 
    {
      // read: ElementRef, // Return the native DOM element reference instead of the TypeScript class instance.
      descendants: true // Enables deep tracking; Angular will find 'Item' components even if they are nested inside other HTML wrappers
    });

  constructor() {
    effect(() => {
      console.log(this.items())
    })
  }
}
