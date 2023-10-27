import html from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/ops-messages.module.css';
import { WarningIcon, InfoIcon } from 'decorator-shared/views/icons';
import { Driftsmelding } from 'decorator-shared/types';

export type OpsMessagesProps = {
  opsMessages: Driftsmelding[];
};

export const OpsMessages = ({ opsMessages }: OpsMessagesProps) => html`
  ${opsMessages.map(
    ({ heading, url, type }) =>
      html`<a
        is="lenke-med-sporing"
        data-analytics-event-args="${JSON.stringify({
          category: 'dekorator-header',
          action: 'driftsmeldinger',
        })}"
        href="${url}"
        class="${cls.opsMessage}"
      >
        ${type === 'prodstatus' ? WarningIcon() : InfoIcon()}
        <span>${heading}</span>
      </a>`,
  )}
`;
