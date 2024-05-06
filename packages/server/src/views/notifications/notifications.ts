import {
    default as archivableCls,
    default as notificationCls,
} from "decorator-client/src/styles/notification.module.css";
import cls from "decorator-client/src/styles/notifications.module.css";
import html from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import { ForwardChevron } from "decorator-shared/views/icons";
import {
    MessageIcon,
    TaskIcon,
} from "decorator-shared/views/icons/notifications";
import {
    MaskedNotification,
    Notification,
    UnmaskedNotification,
} from "../../notifications";

export type NotificationsProps = {
    texts: Texts;
    notifications?: Notification[];
};

const kanalerToMetadata = (kanaler: string[], texts: Texts) => {
    if (kanaler.includes("SMS") && kanaler.includes("EPOST")) {
        return texts.notified_SMS_and_EPOST;
    } else if (kanaler.includes("SMS")) {
        return texts.notified_SMS;
    } else if (kanaler.includes("EPOST")) {
        return texts.notified_EPOST;
    } else {
        return undefined;
    }
};

const MaskedNotificationComp = ({
    notification: { type, date },
    texts,
}: {
    notification: MaskedNotification;
    texts: Texts;
}) =>
    html`<div class="${archivableCls.notification}">
        <div class="${archivableCls.header}">
            <div class="${archivableCls.headerLeft}">
                ${type === "task" ? TaskIcon() : MessageIcon()}
                <div>${texts[type]}</div>
            </div>
            <local-time
                datetime="${date}"
                class="${archivableCls.date}"
            ></local-time>
        </div>
        <div>
            ${type === "task"
                ? texts.masked_task_text
                : texts.masked_message_text}
        </div>
    </div>`;

const NotificationComp = ({
    texts,
    notification: { type, date, link, text, channels },
}: {
    texts: Texts;
    notification: UnmaskedNotification;
}) =>
    html`<link-notification
        class="${notificationCls.notification} ${notificationCls.hover}"
        data-amplitude-komponent="TODO"
    >
        <div class="${notificationCls.header}">
            <div class="${notificationCls.headerLeft}">
                ${type === "task" ? TaskIcon() : MessageIcon()}
                <div>${texts[type]}</div>
            </div>
            <div class="${notificationCls.headerRight}">
                <local-time
                    datetime="${date}"
                    class="${notificationCls.date}"
                ></local-time>
                ${ForwardChevron({ className: notificationCls.chevron })}
            </div>
        </div>
        <a href="${link}" class="${notificationCls.text}">${text}</a>
        ${channels.length > 0 &&
        html`<div class="${notificationCls.metadata}">
            ${kanalerToMetadata(channels, texts)}
        </div>`}
    </link-notification>`;

const ArchivableNotification = ({
    notification: { id, type, date, text, channels },
    texts,
}: {
    notification: UnmaskedNotification;
    texts: Texts;
}) =>
    html`<archivable-notification
        class="${archivableCls.notification}"
        data-id="${id}"
    >
        <div class="${archivableCls.header}">
            <div class="${archivableCls.headerLeft}">
                ${type === "task" ? TaskIcon() : MessageIcon()}
                <div>${texts[type]}</div>
            </div>
            <local-time
                datetime="${date}"
                class="${archivableCls.date}"
            ></local-time>
        </div>
        <div>${text}</div>
        <div class="${archivableCls.bottom}">
            ${channels.length > 0 &&
            html`<div class="${archivableCls.metadata}">
                ${kanalerToMetadata(channels, texts)}
            </div>`}
            <button class="${archivableCls.button}">${texts.archive}</button>
        </div>
    </archivable-notification>`;

export function Notifications({ texts, notifications }: NotificationsProps) {
    return html`<div class="${cls.notifications}">
        <h2 class="${cls.notificationsHeading}">${texts.notifications}</h2>
        <ul class="${cls.notificationList}">
            ${notifications?.map(
                (notification) => html`
                    <li>
                        ${notification.masked === true
                            ? MaskedNotificationComp({ notification, texts })
                            : notification.type === "message" &&
                                !notification.link
                              ? ArchivableNotification({ notification, texts })
                              : NotificationComp({ notification, texts })}
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
