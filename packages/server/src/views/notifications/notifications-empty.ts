import cls from "decorator-client/src/styles/notifications-empty.module.css";
import html from "decorator-shared/html";
import { KattIngenNotifications } from "decorator-shared/views/illustrations";
import i18n from "../../i18n";

export function NotificationsEmpty() {
    return html`
        <div class="${cls.notificationsEmpty}">
            <div>
                <h2 class="${cls.heading}">
                    ${i18n("notifications_empty_list")}
                </h2>
                <p class="${cls.description}">
                    ${i18n("notifications_empty_list_description")}
                </p>
            </div>
            ${KattIngenNotifications({ className: cls.image })}
        </div>
    `;
}
