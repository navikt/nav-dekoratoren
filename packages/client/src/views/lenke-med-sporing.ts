import classes from '../styles/lenke-med-sporing.module.css';

import type { AnalyticsEventArgs } from '../analytics/constants';
import clsx from 'clsx';

export class LenkeMedSporingElement extends HTMLElement {
  constructor() {
    super();

    const a = document.createElement('a');
    a.innerHTML = this.getAttribute('data-children') || '';
    a.href = this.getAttribute('href') || '';

    const attrs = [
      'data-class-name',
      'data-class-name-override',
      // Standard
      'role',
      'id',
      'tabindex',
      'lang',
    ];
    const data = attrs.map((attr) => this.getAttribute(attr) || '');
    const children = this.querySelector('#children')?.innerHTML || '';

    this.innerHTML = '';
    a.innerHTML = children;

    const [className, classNameOverride] = data;
    const rawEventArgs = this.getAttribute('data-analytics-event-args');
    const eventArgs = rawEventArgs
      ? (JSON.parse(rawEventArgs || '{}') as AnalyticsEventArgs)
      : null;

    a.setAttribute('role', this.getAttribute('role') || '');
    a.setAttribute('id', this.getAttribute('id') || '');
    a.setAttribute('tabindex', this.getAttribute('tabindex') || '');
    a.setAttribute('lang', this.getAttribute('lang') || '');

    a.className = clsx(
      classNameOverride || classes.dekoratorLenke,
      className,
      classes.lenkeMedSporing,
    );

    a.addEventListener('click', () => {
      if (eventArgs) {
        window.analyticsEvent(eventArgs);
      }
    });

    // if (withChevron) {
    //   a.classList.add(classes.chevronLenke);
    // }

    // if (withChevron || withLock) {
    //   a.innerHTML = html`
    //     <div class="${classes.ikonContainer}">
    //       ${withLock
    //         ? Lock({ height: '18px', width: '18px' })
    //         : withChevron
    //         ? Next()
    //         : ''}
    //     </div>
    //     ${children}
    //   `;
    // }

    this.appendChild(a);
  }
}

customElements.define('lenke-med-sporing', LenkeMedSporingElement);

/*
 * Definerer en helper funksjon for rendering siden det er mange paramtere som er viktig at typesjekkes
 * */
