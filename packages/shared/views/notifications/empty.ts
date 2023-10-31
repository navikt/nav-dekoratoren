import html from '../../html';
import cls from './empty.module.css';

export type NotificationsEmptyProps = {
  texts: {
    notifications_empty_list: string;
    notifications_empty_list_description: string;
    notifications_show_all: string;
  };
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
