import cls from "decorator-client/src/styles/notifications.module.css";
import html from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import { ArchivableNotification } from "./archivable-notification";
import { Notification } from "./notification";

export type Notification = {
    title: string;
    metadata?: string;
    text: string;
    date: string;
    icon: "task" | "message";
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

export type NotificationsProps = {
    texts: Texts;
    notifications?: Notification[];
};

export function Notifications({ texts, notifications }: NotificationsProps) {
    return html`<div class="${cls.notifications}">
        <h2 class="${cls.notificationsHeading}">${texts.notifications}</h2>
        <ul class="${cls.notificationList}">
            ${notifications?.map(
                (notification) => html`
                    <li>
                        ${notification.isArchivable
                            ? ArchivableNotification({ ...notification, texts })
                            : Notification(notification)}
                    </li>
                `,
            )}
        </ul>
        <a
            class="${cls.allNotificationsLink}"
            href="${process.env.VITE_MIN_SIDE_URL}/tidligere-varsler"
        >
            ${texts.earlier_notifications}
        </a>
    </div>`;
}
