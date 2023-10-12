import html, { Template, json } from 'decorator-shared/html';
import { AnalyticsEventArgs } from 'decorator-client/src/analytics/constants';

export type LenkeMedSporingProps = {
  role?: string;
  href: string;
  id?: string;
  /*
   * Markup that can be injected
   */
  children: Template;
  analyticsEventArgs?: AnalyticsEventArgs;
  classNameOverride?: string;
  className?: string;
  // not optimal solution, see if we can use extends 'a' instead
  containerClassName?: string;
  closeMenusOnClick?: boolean;
  tabIndex?: number;
  lang?: string;
  extraAttrs?: [string, string][];
  defaultStyle?: boolean;
  attachContext?: boolean;
};

export function LenkeMedSporing({
  defaultStyle = true,
  attachContext = false,
  ...props
}: LenkeMedSporingProps) {
  const className = props.className || '';
  const classNameOverride = props.classNameOverride || '';
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
      data-class-name-override="${classNameOverride}"
      data-container-class-name="${props.containerClassName}"
      data-class-name="${className}"
      data-extra-attrs='${props.extraAttrs ? json(props.extraAttrs): ''}'
      ${attachContext ? html`data-attach-context="true"` : ''}
      ${defaultStyle ? html`data-default-style="true"` : ''}
    >
    ${props.children}
    </a>
  `;
}
