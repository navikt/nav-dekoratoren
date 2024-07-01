import clsx from "clsx";
import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/notifications.module.css";
import html from "decorator-shared/html";
import { ForwardChevron } from "decorator-shared/views/icons";
import {
    MessageIcon,
    TaskIcon,
} from "decorator-shared/views/icons/notifications";
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
        <div class="${cls.header}">
            <div class="${cls.headerLeft}">
                ${type === "task" ? TaskIcon() : MessageIcon()}
                <div>${i18n(type)}</div>
            </div>
            <local-time datetime="${date}" class="${cls.date}"></local-time>
        </div>
        <div>
            ${type === "task"
                ? i18n("masked_task_text")
                : i18n("masked_message_text")}
        </div>
    </div>`;

const NotificationComp = ({
    notification: { id, type, date, link, text, channels },
}: {
    notification: UnmaskedNotification;
}) =>
    html` <link-notification
        class="${cls.notification} ${cls.linkNotification}"
        data-type="${type}"
        data-id="${id}"
    >
        <div class="${cls.header}">
            <div class="${cls.headerLeft}">
                ${type === "task" ? TaskIcon() : MessageIcon()}
                <div>${i18n(type)}</div>
            </div>
            <div class="${cls.headerRight}">
                <local-time datetime="${date}" class="${cls.date}"></local-time>
                ${ForwardChevron({ className: cls.chevron })}
            </div>
        </div>
        <a href="${link}" class="${cls.text}">${text}</a>
        ${channels.length > 0 &&
        html` <div class="${cls.metadata}">
            ${kanalerToMetadata(channels)}
        </div>`}
    </link-notification>`;

const ArchivableNotification = ({
    notification: { id, type, date, text, channels },
}: {
    notification: UnmaskedNotification;
}) =>
    html` <archivable-notification class="${cls.notification}" data-id="${id}">
        <div class="${cls.header}">
            <div class="${cls.headerLeft}">
                ${type === "task" ? TaskIcon() : MessageIcon()}
                <div>${i18n(type)}</div>
            </div>
            <local-time datetime="${date}" class="${cls.date}"></local-time>
        </div>
        <div>${text}</div>
        <div class="${cls.bottom}">
            ${channels.length > 0 &&
            html` <div class="${cls.metadata}">
                ${kanalerToMetadata(channels)}
            </div>`}
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
                globalCls["navds-link"],
                globalCls["navds-link--neutral"],
            )}"
            href="${minsideUrl}/tidligere-varsler"
        >
            ${i18n("earlier_notifications")}
        </a>
    </div>`;
}
