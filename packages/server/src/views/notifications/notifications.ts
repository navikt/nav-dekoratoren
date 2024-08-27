import clsx from "clsx";
import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/notifications.module.css";
import { ChatElipsisIcon, ClipboardIcon } from "decorator-icons";
import html from "decorator-shared/html";
import i18n from "../../i18n";
import {
    MaskedNotification,
    Notification,
    UnmaskedNotification,
} from "../../notifications";
import { NotificationsErrorView } from "../errors/notifications-error";
import { NotificationsEmpty } from "./notifications-empty";

export type NotificationsProps = {
    notifications: Notification[] | null;
    minsideUrl: string;
};

const kanalerToMetadata = (kanaler: string[]) => {
    if (kanaler.includes("SMS") && kanaler.includes("EPOST")) {
        return i18n("notified_SMS_and_EPOST");
    } else if (kanaler.includes("SMS")) {
        return i18n("notified_SMS");
    } else if (kanaler.includes("EPOST")) {
        return i18n("notified_EPOST");
    } else {
        return undefined;
    }
};

const MaskedNotificationComp = ({
    notification: { type, date },
}: {
    notification: MaskedNotification;
}) =>
    html` <div class="${cls.notification}">
        <div class="${cls.icon}">
            ${type === "task" ? ClipboardIcon() : ChatElipsisIcon()}
        </div>
        <div class="${cls.content}">
            <div class="${cls.text}">
                ${type === "task"
                    ? i18n("masked_task_text")
                    : i18n("masked_message_text")}
            </div>
            <div class="${cls.metadata}">
                <local-time datetime="${date}" class="${cls.date}"></local-time>
                <div>${i18n(type)}</div>
            </div>
        </div>
    </div>`;

const NotificationComp = ({
    notification: { id, type, date, link, text, channels },
}: {
    notification: UnmaskedNotification;
}) =>
    html` <link-notification
        class="${cls.notification}"
        data-type="${type}"
        data-id="${id}"
    >
        <div class="${cls.icon}">
            ${type === "task" ? ClipboardIcon() : ChatElipsisIcon()}
        </div>
        <div class="${cls.content}">
            <div class="${cls.text}">
                <a href="${link}">${text}</a>
            </div>
            <div class="${cls.metadata}">
                <local-time datetime="${date}" class="${cls.date}"></local-time>
                ${channels.length > 0 &&
                html` <div class="">${kanalerToMetadata(channels)}</div>`}
                <div>${i18n(type)}</div>
            </div>
        </div>
    </link-notification>`;

const ArchivableNotification = ({
    notification: { id, type, date, text, channels },
}: {
    notification: UnmaskedNotification;
}) =>
    html` <archivable-notification class="${cls.notification}" data-id="${id}">
        <div class="${cls.icon}">
            ${type === "task" ? ClipboardIcon() : ChatElipsisIcon()}
        </div>
        <div class="${cls.content}">
            <div class="${cls.text}">${text}</div>
            <div class="${cls.metadata}">
                <local-time datetime="${date}" class="${cls.date}"></local-time>
                ${channels.length > 0 &&
                html` <div class="">${kanalerToMetadata(channels)}</div>`}
                <div>${i18n(type)}</div>
            </div>
            <button class="${cls.button}">${i18n("archive")}</button>
        </div>
    </archivable-notification>`;

export function Notifications({
    notifications,
    minsideUrl,
}: NotificationsProps) {
    return html` <div class="${cls.notifications}">
        <h2 class="${cls.notificationsHeading}">${i18n("notifications")}</h2>
        ${notifications
            ? notifications.length > 0
                ? html`<ul class="${cls.notificationList}">
                      ${notifications.map(
                          (notification) => html`
                              <li>
                                  ${notification.masked
                                      ? MaskedNotificationComp({
                                            notification,
                                        })
                                      : notification.type === "message" &&
                                          !notification.link
                                        ? ArchivableNotification({
                                              notification,
                                          })
                                        : NotificationComp({
                                              notification,
                                          })}
                              </li>
                          `,
                      )}
                  </ul>`
                : NotificationsEmpty({ minsideUrl })
            : NotificationsErrorView()}
        <a
            class="${clsx(
                cls.allNotificationsLink,
                aksel["navds-link"],
                aksel["navds-link--neutral"],
            )}"
            href="${minsideUrl}/tidligere-varsler"
        >
            ${i18n("earlier_notifications")}
        </a>
    </div>`;
}
