import html, { Template } from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/archivable-notification.module.css';

export type ArchivableNotificationProps = {
  id: string;
  text: string;
  date: string;
  icon: Template;
  tags: string[];
  texts: {
    archive: string;
  };
};

export const ArchivableNotification = ({
  id,
  text,
  date,
  icon,
  tags,
  texts,
}: ArchivableNotificationProps) =>
  html`<archivable-notification class="${cls.notification}" data-id="${id}">
    <div>
      <div>${text}</div>
      <local-time datetime="${date}" class="${cls.date}" />
    </div>
    <div class="${cls.bottom}">
      ${icon}${tags.map((tag) => html`<div class="${cls.tag}">${tag}</div>`)}
      <button class="${cls.button}">${texts.archive}</button>
    </div>
  </archivable-notification>`;
