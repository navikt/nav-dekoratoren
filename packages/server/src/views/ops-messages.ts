import cls from 'decorator-client/src/styles/ops-messages.module.css';
import html from 'decorator-shared/html';
import { OpsMessage } from 'decorator-shared/types';
import utilsCls from 'decorator-client/src/styles/utilities.module.css';
import { InfoIcon, WarningIcon } from 'decorator-shared/views/icons';

export type OpsMessagesProps = {
  opsMessages: OpsMessage[];
};

export const OpsMessages = ({ opsMessages }: OpsMessagesProps) => html`
  <div class="${cls.opsMessagesContent} ${utilsCls.contentContainer}">
    ${opsMessages.map(
      ({ heading, url, type }) =>
        html`<lenke-med-sporing
          data-analytics-event-args="${JSON.stringify({
            category: 'dekorator-header',
            action: 'driftsmeldinger',
          })}"
          href="${url}"
          class="${cls.opsMessage}"
        >
          ${type === 'prodstatus' ? WarningIcon() : InfoIcon()}
          <span>${heading}</span>
        </lenke-med-sporing>`,
    )}
  </div>
`;
