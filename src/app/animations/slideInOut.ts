// import the required animation functions from the angular animations module
import { trigger, query, animateChild, animate, transition, style } from '@angular/animations';

export const parentIf = trigger('parentIf', [
  transition(':enter', [query('@*', [animateChild()], { optional: true })]),
  transition(':leave', [query('@*', [animateChild()], { optional: true })])
]);

export const slideInOutAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('slideInOutAnimation', [
    // end state styles for route container (host)
    transition(':enter', [
      style({ transform: 'translateY(100%)' }),
      animate('0.25s', style({ transform: 'translateY(0)' }))
    ]),
    transition(':leave', [animate('0.23s', style({ transform: 'translateY(100%)' }))])
  ]);

export const slidelrAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('slidelrAnimation', [
    // end state styles for route container (host)
    transition(':enter', [
      style({ transform: 'translateX(100%)', position: 'fixed', width: '100%' }),
      animate('.25s', style({ transform: 'translateX(0)' }))
    ]),
    transition(':leave', [
      style({ position: 'fixed', width: '100%' }),
      animate('0.15s', style({ transform: 'translateX(100%)' }))
    ])
  ]);

export const msgSlideAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('msgSlideAnimation', [
    // end state styles for route container (host)
    transition(':leave', [
      // style({ position: 'fixed', width: '100%' }),
      animate('0.35s 100ms ease-in-out', style({ transform: 'translateX(100%)' }))
    ])
  ]);

export const convSlideup = trigger('convSlideup', [
  transition(':leave', [
    style({ 'transform-origin': '100% 0' }),
    animate('0.3s 100ms ease-out', style({ transform: 'scaleY(0)' }))
  ])
]);
