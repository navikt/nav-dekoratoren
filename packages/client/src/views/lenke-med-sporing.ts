import html from 'decorator-shared/html';
import {
  analyticsEvent,
  type AnalyticsEventArgs,
} from '../analytics/analytics';
import { Lock } from 'decorator-shared/views/icons/lock';
import { Next } from 'decorator-shared/views/icons/next';

import classes from './lenke-med-sporing.module.css';

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
    console.log(eventArgs);

    a.setAttribute('role', this.getAttribute('role') || '');
    a.setAttribute('id', this.getAttribute('id') || '');
    a.setAttribute('tabindex', this.getAttribute('tabindex') || '');
    a.setAttribute('lang', this.getAttribute('lang') || '');

    a.addEventListener('click', () => {
      if (eventArgs) {
        analyticsEvent(eventArgs);
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
            ? Next({})
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
      data-with-lock="${props.withLock}"
      data-analytics-event-args="${JSON.stringify(props.analyticsEventArgs)}"
      data-children="${props.children}"
      data-class-name-override="${props.classNameOverride}"
      data-class-name="${props.className}"
    >
    </lenke-med-sporing>
  `;
}

// import React from 'react';
// import { Next } from '@navikt/ds-icons';
// import { AnalyticsEventArgs, analyticsEvent } from 'utils/analytics/analytics';
// import Lock from 'ikoner/meny/Lock';
// import { lukkAlleDropdowns } from 'store/reducers/dropdown-toggle-duck';
// import { useDispatch } from 'react-redux';
// import classNames from 'classnames';
// import style from './LenkeMedSporing.module.scss';
//
// type Props = {
//     role?: string;
//     href: string;
//     children: React.ReactNode;
//     analyticsEventArgs?: AnalyticsEventArgs;
//     classNameOverride?: string;
//     withChevron?: boolean;
//     withLock?: boolean;
//     closeMenusOnClick?: boolean;
// } & React.HTMLAttributes<HTMLAnchorElement>;
//
// export const LenkeMedSporing = ({
//     role,
//     href,
//     children,
//     analyticsEventArgs,
//     className,
//     classNameOverride,
//     id,
//     onClick,
//     tabIndex,
//     withChevron,
//     withLock,
//     closeMenusOnClick = true,
//     lang,
// }: Props) => {
//     const dispatch = useDispatch();
//
//     return (
//         <a
//             role={role}
//             href={href}
//             className={classNames(
//                 classNameOverride || style.dekoratorLenke,
//                 withChevron && style.chevronlenke,
//                 className,
//                 style.lenkeMedSporing
//             )}
//             id={id}
//             tabIndex={tabIndex}
//             onAuxClick={(event) =>
//                 analyticsEventArgs && event.button && event.button === 1 && analyticsEvent(analyticsEventArgs)
//             }
//             onClick={(event) => {
//                 if (closeMenusOnClick) {
//                     dispatch(lukkAlleDropdowns());
//                 }
//                 if (onClick) {
//                     onClick(event);
//                 }
//                 if (analyticsEventArgs) {
//                     analyticsEvent(analyticsEventArgs);
//                 }
//             }}
//             lang={lang}
//         >
//             <>
//                 {(withLock || withChevron) && (
//                     <div className={style.ikonContainer}>
//                         {withLock ? (
//                             <Lock height={'18px'} width={'18px'} aria-hidden />
//                         ) : (
//                             withChevron && <Next className={style.chevron} aria-hidden />
//                         )}
//                     </div>
//                 )}
//                 {children}
//             </>
//         </a>
//     );
// };
//
