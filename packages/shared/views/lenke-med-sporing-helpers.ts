import html, { Template, json } from 'decorator-shared/html';
import { AnalyticsEventArgs } from 'decorator-client/src/analytics/constants';

export type LenkeMedSporingProps = {
  role?: string;
  href: string;
  id?: string;
  /*
   * Markup that can be injected
   */
  children: Template | string;
  analyticsEventArgs?: AnalyticsEventArgs;
  className?: string;
  // not optimal solution, see if we can use extends 'a' instead
  containerClassName?: string;
  closeMenusOnClick?: boolean;
  tabIndex?: number;
  lang?: string;
  attachContext?: boolean;
  dataContext?: string;
  dataHandleInApp?: boolean;
};

export function LenkeMedSporing({
  attachContext = false,
  className,
  dataContext,
  dataHandleInApp,
  ...props
}: LenkeMedSporingProps) {
  // Added this here so that the JSON string is not malformed
  // prettier-ignore
  return html`
    <a
      is="lenke-med-sporing"
      role="${props.role}"
      href="${props.href}"
      id="${props.id}"
      tabindex="${props.tabIndex}"
      lang="${props.lang}"
      data-analytics-event-args='${json(props.analyticsEventArgs)}'
      class="${className}"
      ${dataHandleInApp ? html`data-handle-in-app="true"` : ''}
      ${dataContext ? html`data-context="${dataContext}"` : ''}
      ${attachContext ? html`data-attach-context="true"` : ''}
    >
    ${props.children}
    </a>
  `;
}
