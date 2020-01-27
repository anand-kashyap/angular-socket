import { animate, animateChild, group, query as q, style, transition, trigger } from '@angular/animations';
export function query(s, a, o = { optional: true }) {
  return q(s, a, o);
}

export const routerTransition = trigger('routerTransition', [
  transition('* => *', [
    query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' })),
    query(':enter', style({ transform: 'translateX(100%)' })),

    group([
      query(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('500ms ease-out', style({ transform: 'translateX(-100%)' }))
      ]),
      query(':enter', [animate('500ms ease-out', style({ transform: 'translateX(0%)' })), animateChild()])
    ])
  ])
]);
