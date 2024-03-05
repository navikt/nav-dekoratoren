import html, { Template, htmlAttributes } from 'decorator-shared/html';
import { AnalyticsEventArgs } from 'decorator-client/src/analytics/constants';

export type LenkeMedSporingProps = {
    href: string;
    analyticsEventArgs: AnalyticsEventArgs;
    className?: string;
    dataContext?: string;
    dataHandleInApp?: boolean;
    children: Template | string;
};

export const LenkeMedSporing = ({ children, analyticsEventArgs, ...props }: LenkeMedSporingProps) => html`
    <lenke-med-sporing data-analytics-event-args="${JSON.stringify(analyticsEventArgs)}" ${htmlAttributes(props)}> ${children} </lenke-med-sporing>
`;
// export const LenkeMedSporing = ({
//   children,
//   analyticsEventArgs,
//   ...props
// }: LenkeMedSporingProps) => html`
//   <a
//     is="lenke-med-sporing"
//     data-analytics-event-args="${JSON.stringify(analyticsEventArgs)}"
//     ${htmlAttributes(props)}
//   >
//     ${children}
//   </a>
// `;
