import html from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/ops-messages.module.css';
import { WarningIcon } from 'decorator-shared/views/icons';

export type OpsMessagesProps = {
  opsMessages: {
    heading: string;
    url: string;
  }[];
};

export const OpsMessages = ({ opsMessages }: OpsMessagesProps) => html`
  ${opsMessages.map(
    ({ heading, url }) =>
      html`<a href="${url}" class="${cls.opsMessage}">
        ${WarningIcon()}
        <span>${heading}</span>
      </a>`,
  )}
`;
