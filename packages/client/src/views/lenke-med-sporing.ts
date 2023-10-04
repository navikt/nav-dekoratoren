import html from 'decorator-shared/html';
import { Lock } from 'decorator-shared/views/icons/lock';
import { Next } from 'decorator-shared/views/icons/next';

import classes from './lenke-med-sporing.module.css';
import type { AnalyticsEventArgs } from '../analytics/constants';

// @TODO Split up visual itnto seperate components

export class LenkeMedSporingElement extends HTMLElement {
  constructor() {
    super();

    const a = document.createElement('a');
    a.innerHTML = this.getAttribute('data-children') || '';
    a.href = this.getAttribute('href') || '';
    a.className = classes.lenkeMedSporing;

    const attrs = [
      'data-with-chevron',
      'data-with-lock',
      'data-children',
      'data-class-name',
      'data-class-name-override',
      // Standard
      'role',
      'id',
      'tabindex',
      'lang',
    ];
    const data = attrs.map((attr) => this.getAttribute(attr) || '');
    const [withChevron, withLock, children, className, classNameOverride] =
      data;
    const rawEventArgs = this.getAttribute('data-analytics-event-args');
    const eventArgs = rawEventArgs
      ? (JSON.parse(rawEventArgs || '{}') as AnalyticsEventArgs)
      : null;

    a.setAttribute('role', this.getAttribute('role') || '');
    a.setAttribute('id', this.getAttribute('id') || '');
    a.setAttribute('tabindex', this.getAttribute('tabindex') || '');
    a.setAttribute('lang', this.getAttribute('lang') || '');

    a.addEventListener('click', () => {
      if (eventArgs) {
        window.analyticsEvent(eventArgs);
      }
    });

    a.classList.add(classNameOverride || classes.dekoratorLenke);
    a.classList.add(classes.lenkeMedSporing);

    if (className) {
      a.classList.add(className || '');
    }

    if (withChevron) {
      a.classList.add(classes.chevronLenke);
    }

    if (withChevron || withLock) {
      a.innerHTML = html`
        <div class="${classes.ikonContainer}">
          ${withLock
            ? Lock({ height: '18px', width: '18px' })
            : withChevron
            ? Next()
            : ''}
        </div>
        ${children}
      `;
    }

    this.appendChild(a);
  }
}

customElements.define('lenke-med-sporing', LenkeMedSporingElement);

/*
 * Definerer en helper funksjon for rendering siden det er mange paramtere som er viktig at typesjekkes
 * */
type LenkeMedSporingProps = {
  role?: string;
  href: string;
  id?: string;
  /*
   * Markup that can be injected
   */
  children: string;
  analyticsEventArgs?: AnalyticsEventArgs;
  classNameOverride?: string;
  className?: string;
  withChevron?: boolean;
  withLock?: boolean;
  // @todo: definer en global funksjon her som kan kalles
  closeMenusOnClick?: boolean;
  tabIndex?: number;
  lang?: string;
};

export function LenkeMedSporing(props: LenkeMedSporingProps) {
  return html`
    <lenke-med-sporing
      role="${props.role}"
      href="${props.href}"
      id="${props.id}"
      tabindex="${props.tabIndex}"
      lang="${props.lang}"
      data-with-chevron="${props.withChevron}"
      data-analytics-event-args="${JSON.stringify(props.analyticsEventArgs)}"
      data-with-lock="${props.withLock}"
      data-children="${props.children}"
      data-class-name-override="${props.classNameOverride}"
      data-class-name="${props.className}"
    >
    </lenke-med-sporing>
  `;
}
