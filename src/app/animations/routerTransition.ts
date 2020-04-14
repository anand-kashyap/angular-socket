import { trigger, transition, group, query, style, animate, animateChild } from '@angular/animations';

const transQuery = dir => {
  let enter = 100;
  let leave = -100;
  if (dir === 'left') {
    (enter = -100), (leave = 100);
  }
  return [
    query(':enter, :leave', style({ position: 'fixed', width: '100%', height: '100%' }), { optional: true }),
    query(':enter', style({ transform: `translateX(${enter}%)` }), { optional: true }),
    group([
      query(
        ':leave',
        [
          style({ transform: 'translateX(0%)' }),
          animate('500ms ease-out', style({ transform: `translateX(${leave}%)` })),
          animateChild()
        ],
        { optional: true }
      ),
      query(':enter', [animate('500ms ease-out', style({ transform: 'translateX(0%)' })), animateChild()], {
        optional: true
      })
    ])
  ];
};

export class RouterAnimations {
  static routerTransition = trigger('routerTransition', [
    transition(':increment', transQuery('right')),
    transition(':decrement', transQuery('left'))
  ]);
}
