import html from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/archivable-notification.module.css';

export type ArchivableNotificationProps = {
  text: string;
  date: string;
  icon: string;
  tags: string[];
  texts: {
    archive: string;
  };
};

export const ArchivableNotification = ({
  text,
  date,
  icon,
  tags,
  texts,
}: ArchivableNotificationProps) =>
  html`<archivable-notification class="${cls.notification}">
    <div>
      <div>${text}</div>
      <div class="${cls.date}">${date}</div>
    </div>
    <div class="${cls.bottom}">
      ${icon}${tags.map((tag) => html`<div class="${cls.tag}">${tag}</div>`)}
      <button class="${cls.button}">${texts.archive}</button>
    </div>
  </archivable-notification>`;
