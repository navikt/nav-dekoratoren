import html from '../html';

export type NotificationsEmptyProps = {
  texts: {
    notifications_empty_list: string;
    notifications_empty_list_description: string;
    notifications_show_all: string;
  };
};

export function NotificationsEmptyView({ texts }: NotificationsEmptyProps) {
  return html`
    <div id="notifications-empty">
      <img src="/public/kattIngenNotifications.svg" alt="" />
      <h1>${texts.notifications_empty_list}</h1>
      <p>${texts.notifications_empty_list_description}</p>
      <a href="${import.meta.env.VITE_MIN_SIDE_URL}/all-notifications"
        >${texts.notifications_show_all}</a
      >
    </div>
  `;
}

export function NotificationsUnread() {
  return html` <div class="notifications-unread"></div> `;
}
