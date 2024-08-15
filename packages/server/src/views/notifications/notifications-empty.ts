import clsx from "clsx";
import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/notifications-empty.module.css";
import html from "decorator-shared/html";
import { KattIngenNotifications } from "decorator-shared/views/illustrations";
import i18n from "../../i18n";

export function NotificationsEmpty({ minsideUrl }: { minsideUrl: string }) {
    return html`
        <div class="${cls.notificationsEmpty}">
            <div>
                <h2 class="${cls.heading}">
                    ${i18n("notifications_empty_list")}
                </h2>
                <p class="${cls.description}">
                    ${i18n("notifications_empty_list_description")}
                </p>
                <a
                    class="${clsx(
                        aksel["navds-link"],
                        aksel["navds-link--neutral"],
                    )}"
                    href="${minsideUrl}/tidligere-varsler"
                >
                    ${i18n("notifications_show_all")}
                </a>
            </div>
            ${KattIngenNotifications({ className: cls.image })}
        </div>
    `;
}
