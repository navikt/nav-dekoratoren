import classes from '../styles/lenke-med-sporing.module.css';

import type { AnalyticsEventArgs } from '../analytics/constants';
import clsx from 'clsx';

export class LenkeMedSporingElement extends HTMLAnchorElement {
  constructor() {
    super();

    // const a = document.createElement('a');
    // a.innerHTML = this.getAttribute('data-children') || '';
    // a.href = this.getAttribute('href') || '';

    const attrs = [
      'data-class-name',
      'data-class-name-override',
      'data-container-class-name',
      'data-default-style',
      'data-attach-context',
      // Standard
      'role',
      'id',
      'tabindex',
      'lang',
    ];

    const data = attrs.map((attr) => this.getAttribute(attr) || '');
    // const children = this.querySelector('#children')?.innerHTML || '';

    // this.innerHTML = '';
    // a.innerHTML = children;

    const [
      className,
      classNameOverride,
      containerClassName,
      defaultStyleEnabled,
      attachContext,
    ] = data;
    this.className = containerClassName;

    const rawEventArgs = this.getAttribute('data-analytics-event-args');
    const eventArgs = rawEventArgs
      ? (JSON.parse(rawEventArgs) as AnalyticsEventArgs)
      : null;

    const extraAttrsVal = this.getAttribute('data-extra-attrs');
    const extraAttrs = extraAttrsVal
      ? (JSON.parse(extraAttrsVal) as [string, string][])
      : [];

    for (const [key, value] of extraAttrs) {
      this.setAttribute(key, value);
    }

    this.className = clsx(
      classNameOverride || classes.dekoratorLenke,
      className,
      {
        [classes.lenkeMedSporing]: defaultStyleEnabled,
      },
    );

    this.addEventListener('click', () => {
      if (eventArgs) {
        const payload = {
          ...eventArgs,
          ...(attachContext && {
            context: window.__DECORATOR_DATA__.params.context,
          }),
        };
        window.analyticsEvent(payload);
      }
    });

    // this.appendChild(a);
  }
}

customElements.define('lenke-med-sporing', LenkeMedSporingElement, {
  extends: 'a',
});

/*
 * Definerer en helper funksjon for rendering siden det er mange paramtere som er viktig at typesjekkes
 * */
