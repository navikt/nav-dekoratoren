import classes from 'decorator-shared/views/lenke-med-sporing/lenke-med-sporing.module.css';

import type { AnalyticsEventArgs } from '../../analytics/constants';
import clsx from 'clsx';
import { tryParse } from 'decorator-shared/json';

export class LenkeMedSporingElement extends HTMLAnchorElement {
  constructor() {
    super();

    const attrs = [
      'data-class-name',
      'data-class-name-override',
      'data-container-class-name',
      'data-default-style',
      'data-attach-context',
    ];

    const data = attrs.map((attr) => this.getAttribute(attr) || '');

    const [
      className,
      classNameOverride,
      containerClassName,
      defaultStyleEnabled,
      attachContext,
    ] = data;
    this.className = containerClassName;

    const rawEventArgs = this.getAttribute('data-analytics-event-args');
    const eventArgs = tryParse<AnalyticsEventArgs, null>(rawEventArgs, null);

    const extraAttrsVal = this.getAttribute('data-extra-attrs');

    const extraAttrs = tryParse<[string, string][], []>(extraAttrsVal, []);

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
  }
}

customElements.define('lenke-med-sporing', LenkeMedSporingElement, {
  extends: 'a',
});

/*
 * Definerer en helper funksjon for rendering siden det er mange paramtere som er viktig at typesjekkes
 * */
