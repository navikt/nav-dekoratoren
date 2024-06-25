import clsx from "clsx";
import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/notifications-empty.module.css";
import html from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import { KattIngenNotifications } from "decorator-shared/views/illustrations";

export type NotificationsEmptyProps = {
    texts: Texts;
};

export function NotificationsEmpty({ texts }: NotificationsEmptyProps) {
    return html`
        <div class="${cls.notificationsEmpty}">
            <div>
                <h2 class="${cls.heading}">
                    ${texts.notifications_empty_list}
                </h2>
                <p class="${cls.description}">
                    ${texts.notifications_empty_list_description}
                </p>
                <a
                    class="${clsx(
                        globalCls["navds-link"],
                        globalCls["navds-link--neutral"],
                    )}"
                    href="${process.env.VITE_MIN_SIDE_URL}/tidligere-varsler"
                >
                    ${texts.notifications_show_all}
                </a>
            </div>
            ${KattIngenNotifications({ className: cls.image })}
        </div>
    `;
}
