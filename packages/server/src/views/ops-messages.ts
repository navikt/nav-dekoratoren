import cls from '@styles/ops-messages.module.json';
import html from 'decorator-shared/html';
import { OpsMessage } from 'decorator-shared/types';
import utilsCls from '@styles/utilities.module.json';
import { InfoIcon, WarningIcon } from 'decorator-shared/views/icons';

export type OpsMessagesProps = {
  opsMessages: OpsMessage[];
};

export const OpsMessages = ({ opsMessages }: OpsMessagesProps) => html`
  <div class="${cls.opsMessagesContent} ${utilsCls.contentContainer}">
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
  </div>
`;
