import cls from 'decorator-client/src/styles/notifications-empty.module.css';
import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';

export type NotificationsEmptyProps = {
  texts: Texts;
};

export function NotificationsEmpty({ texts }: NotificationsEmptyProps) {
  return html`
    <div class="${cls.notificationsEmpty}">
      <div>
        <h2 class="${cls.heading}">${texts.notifications_empty_list}</h2>
        <p class="${cls.description}">
          ${texts.notifications_empty_list_description}
        </p>
        <a
          class="${cls.link}"
          href="${process.env.VITE_MIN_SIDE_URL}/all-notifications"
        >
          ${texts.notifications_show_all}
        </a>
      </div>
      <img
        class="${cls.image}"
        src="/public/ikoner/varsler/kattIngenNotifications.svg"
        alt=""
      />
    </div>
  `;
}
