import html from 'decorator-shared/html';
import { Lock } from 'decorator-shared/views/icons/lock';
import { Next } from 'decorator-shared/views/icons/next';

import classes from '../styles/lenke-med-sporing.module.css';
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

    a.addEventListener('click', () => {
      if (eventArgs) {
        window.analyticsEvent(eventArgs);
      }
    });

    if (className) {
      a.className = className;
      // a.classList.add(className || '');
    }

    if (classNameOverride) {
      console.log('This is hit');
      a.classList.add(classNameOverride);
    } else {
      console.log('This is not hit');
      a.classList.add(classes.dekoratorLenke);
    }

    a.classList.add(classes.lenkeMedSporing);

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
  // withChevron?: boolean;
  // withLock?: boolean;
  // @todo: definer en global funksjon her som kan kalles
  closeMenusOnClick?: boolean;
  tabIndex?: number;
  lang?: string;
};

export function LenkeMedSporing(props: LenkeMedSporingProps) {
  const className = props.className || '';
  const classNameOverride = props.classNameOverride || '';
  // Added this here so that the JSON string is not malformed
  // prettier-ignore
  return html`
    <lenke-med-sporing
      role="${props.role}"
      href="${props.href}"
      id="${props.id}"
      tabindex="${props.tabIndex}"
      lang="${props.lang}"
      data-analytics-event-args='${JSON.stringify(props.analyticsEventArgs)}'
      data-class-name-override="${classNameOverride}"
      data-class-name="${className}"
    >
    <div id="children">${props.children}</div>
    </lenke-med-sporing>
  `;
}

// @note: these two can maybe be simplified
export function LenkeMedSporingChevron(props: LenkeMedSporingProps) {
  const className = props.className || '';

  return LenkeMedSporing({
    ...props,
    className: `${className} ${classes.chevronlenke}`,
    children: `
            <div class="${classes.ikonContainer}">
                ${Next({
                  className: classes.chevron,
                })}
            </div>${props.children}`,
  });
}

export function LenkeMedSporingLock(props: LenkeMedSporingProps) {
  const className = props.className || '';

  return LenkeMedSporing({
    ...props,
    className: `${className} ${classes.chevronlenke}`,
    children: `
            <div class="${classes.ikonContainer}">
                ${Lock({
                  width: '18px',
                  height: '18px',
                })}
            </div>${props.children}`,
  });
}
