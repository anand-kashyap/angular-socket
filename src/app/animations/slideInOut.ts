// import the required animation functions from the angular animations module
import { trigger, state, animate, transition, style, group } from '@angular/animations';

export const slideInOutAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('slideInOutAnimation', [
    // end state styles for route container (host)
    transition(':enter', [style({ height: 0 }), animate(1850, style({ height: '*' }))]),
    transition(':leave', [style({ height: '*' }), animate(150, style({ height: 0 }))])
  ]);
