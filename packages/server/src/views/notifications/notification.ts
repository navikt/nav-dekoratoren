import html from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/notification.module.css';
import { ForwardChevron } from 'decorator-shared/views/icons/forward-chevron';

export type NotificationProps = {
  text: string;
  link: string;
  date: string;
  icon: string;
  tags: string[];
  amplitudeKomponent: string;
};

export const Notification = ({
  text,
  link,
  date,
  icon,
  tags,
  amplitudeKomponent,
}: NotificationProps) =>
  html`<link-notification
    class="${cls.notification}"
    data-amplitude-komponent="${amplitudeKomponent}"
  >
    <div>
      <a href="${link}" class="${cls.text}">${text}</a>
      <local-time datetime="${date}" class="${cls.date}" />
    </div>
    <div class="${cls.bottom}">
      ${icon}${tags.map((tag) => html`<div class="${cls.tag}">${tag}</div>`)}
      ${ForwardChevron({ className: cls.chevron })}
    </div>
  </link-notification>`;
