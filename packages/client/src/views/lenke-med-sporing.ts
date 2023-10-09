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
      'data-container-class-name',
      'data-default-style',
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

    const [
      className,
      classNameOverride,
      containerClassName,
      defaultStyleEnabled,
    ] = data;
    this.className = containerClassName;

    const rawEventArgs = this.getAttribute('data-analytics-event-args');
    const eventArgs = rawEventArgs
      ? (JSON.parse(rawEventArgs) as AnalyticsEventArgs)
      : null;

    a.setAttribute('role', this.getAttribute('role') || '');
    a.setAttribute('id', this.getAttribute('id') || '');
    a.setAttribute('tabindex', this.getAttribute('tabindex') || '');
    a.setAttribute('lang', this.getAttribute('lang') || '');

    const extraAttrsVal = this.getAttribute('data-extra-attrs');
    const extraAttrs = extraAttrsVal
      ? (JSON.parse(extraAttrsVal) as [string, string][])
      : [];

    for (const [key, value] of extraAttrs) {
      a.setAttribute(key, value);
    }

    a.className = clsx(classNameOverride || classes.dekoratorLenke, className, {
      [classes.lenkeMedSporing]: defaultStyleEnabled,
    });

    a.addEventListener('click', () => {
      if (eventArgs) {
        window.analyticsEvent(eventArgs);
      }
    });

    this.appendChild(a);
  }
}

customElements.define('lenke-med-sporing', LenkeMedSporingElement);

/*
 * Definerer en helper funksjon for rendering siden det er mange paramtere som er viktig at typesjekkes
 * */
