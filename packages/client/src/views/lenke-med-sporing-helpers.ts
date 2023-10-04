// Puttet i sin egen fil slik at det kan brukes på server og i shared

import html from 'decorator-shared/html';
import { AnalyticsEventArgs } from '../analytics/constants';
import classes from '../styles/lenke-med-sporing.module.css';
import { Lock } from 'decorator-shared/views/icons/lock';
import { Next } from 'decorator-shared/views/icons/next';

//
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
  closeMenusOnClick?: boolean;
  tabIndex?: number;
  lang?: string;
};

export function LenkeMedSporingBase(props: LenkeMedSporingProps) {
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

  return LenkeMedSporingBase({
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

  return LenkeMedSporingBase({
    ...props,
    // todo fix this
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

const variants = {
  chevron: LenkeMedSporingChevron,
  lock: LenkeMedSporingLock,
  standard: LenkeMedSporingBase,
};

type VariantKey = keyof typeof variants;

export function LenkeMedSporing(
  props: LenkeMedSporingProps,
  variantKey?: VariantKey,
) {
  const variant = variantKey || 'standard';
  const Component = variants[variant];
  return Component(props);
}
