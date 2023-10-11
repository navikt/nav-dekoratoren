import cls from 'decorator-client/src/styles/notifications.module.css';
import html, { Template } from 'decorator-shared/html';
import { ArchivableNotification } from './archivable-notification';
import { Notification } from './notification';

type Notification = {
  text: string;
  date: string;
  icon: Template;
  tags: string[];
} & (
  | {
      isArchivable: true;
      id: string;
    }
  | {
      isArchivable: false;
      link: string;
      amplitudeKomponent: string;
    }
);

export type NotificationList = {
  heading: string;
  notifications: Notification[];
};

export type NotificationsProps = {
  texts: {
    earlier_notifications: string;
    archive: string;
  };
  notificationLists: NotificationList[];
};

export function Notifications({
  texts,
  notificationLists,
}: NotificationsProps) {
  return html`<div class="${cls.notifications}">
    ${notificationLists.map(
      ({ heading, notifications }) => html`
        <div>
          <h2 class="${cls.notificationListHeading}">${heading}</h2>
          <ul class="${cls.notificationList}">
            ${notifications.map(
              (notification) => html`
                <li>
                  ${notification.isArchivable
                    ? ArchivableNotification({ ...notification, texts })
                    : Notification(notification)}
                </li>
              `,
            )}
          </ul>
        </div>
      `,
    )}
    <div>
      <a
        class="${cls.tidligereNotifications}"
        href="${process.env.VITE_MIN_SIDE_URL}/all-notifications"
      >
        ${texts.earlier_notifications}
      </a>
    </div>
  </div>`;
}
