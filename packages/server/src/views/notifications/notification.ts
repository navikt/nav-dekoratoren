import cls from "decorator-client/src/styles/notification.module.css";
import html from "decorator-shared/html";
import { ForwardChevron } from "decorator-shared/views/icons/forward-chevron";
import {
    MessageIcon,
    TaskIcon,
} from "decorator-shared/views/icons/notifications";

export type NotificationProps = {
    title: string;
    text: string;
    link: string;
    date: string;
    icon: "task" | "message";
    metadata?: string;
    amplitudeKomponent: string;
};

export const Notification = ({
    title,
    text,
    link,
    date,
    icon,
    metadata,
    amplitudeKomponent,
}: NotificationProps) =>
    html`<link-notification
        class="${cls.notification} ${cls.hover}"
        data-amplitude-komponent="${amplitudeKomponent}"
    >
        <div class="${cls.header}">
            <div class="${cls.headerLeft}">
                ${(() => {
                    switch (icon) {
                        case "task":
                            return TaskIcon();
                        case "message":
                            return MessageIcon();
                    }
                })()}
                <div>${title}</div>
            </div>
            <div class="${cls.headerRight}">
                <local-time datetime="${date}" class="${cls.date}"></local-time>
                ${ForwardChevron({ className: cls.chevron })}
            </div>
        </div>
        <a href="${link}" class="${cls.text}">${text}</a>
        ${metadata && html`<div class="${cls.metadata}">${metadata}</div>`}
    </link-notification>`;
