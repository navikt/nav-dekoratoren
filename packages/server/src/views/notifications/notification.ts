import html, { Template } from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/notification.module.css';
import { ForwardChevron } from 'decorator-shared/views/icons/forward-chevron';

export type NotificationProps = {
  title: string;
  text: string;
  link: string;
  date: string;
  icon: Template;
  metadata?: string;
  amplitudeKomponent: string;
};

export const Notification = ({
  title,
  text,
  link,
  date,
  icon,
  metadata,
  amplitudeKomponent,
}: NotificationProps) =>
  html`<link-notification
    class="${cls.notification}"
    data-amplitude-komponent="${amplitudeKomponent}"
  >
    <div class="${cls.header}">
      <div class="${cls.headerLeft}">
        ${icon}
        <div>${title}</div>
      </div>
      <div class="${cls.headerRight}">
        <local-time datetime="${date}" class="${cls.date}"></local-time>
        ${ForwardChevron({ className: cls.chevron })}
      </div>
    </div>
    <a href="${link}" class="${cls.text}">${text}</a>
    ${metadata && html`<div class="${cls.metadata}">${metadata}</div>`}
  </link-notification>`;
