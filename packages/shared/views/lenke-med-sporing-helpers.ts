import html, { Template } from 'decorator-shared/html';
import { AnalyticsEventArgs } from 'decorator-client/src/analytics/constants';

export type LenkeMedSporingProps = {
  href: string;
  analyticsEventArgs: AnalyticsEventArgs;
  attachContext?: boolean;
  className?: string;
  dataContext?: string;
  dataHandleInApp?: boolean;
  children: Template | string;
};

export const LenkeMedSporing = ({
  href,
  analyticsEventArgs,
  attachContext,
  className,
  dataContext,
  dataHandleInApp,
  children,
}: LenkeMedSporingProps) => html`
  <a
    is="lenke-med-sporing"
    href="${href}"
    data-analytics-event-args="${JSON.stringify(analyticsEventArgs)}"
    ${attachContext ? html`data-attach-context="true"` : ''}
    ${className ? html`class="${className}"` : ''}
    ${dataContext ? html`data-context="${dataContext}"` : ''}
    ${dataHandleInApp ? html`data-handle-in-app="true"` : ''}
  >
    ${children}
  </a>
`;
