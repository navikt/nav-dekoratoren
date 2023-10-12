import html from '../../html';
import cls from 'decorator-client/src/styles/notifications-empty.module.css';

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
      <img src="/public/ikoner/varsler/kattIngenNotifications.svg" alt="" />
      <h1>${texts.notifications_empty_list}</h1>
      <p>${texts.notifications_empty_list_description}</p>
      <a href="${process.env.VITE_MIN_SIDE_URL}/all-notifications"
        >${texts.notifications_show_all}</a
      >
    </div>
  `;
}
