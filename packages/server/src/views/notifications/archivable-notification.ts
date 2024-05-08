import cls from "decorator-client/src/styles/notification.module.css";
import html from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import {
    MessageIcon,
    TaskIcon,
} from "decorator-shared/views/icons/notifications";

export type ArchivableNotificationProps = {
    title: string;
    metadata?: string;
    id: string;
    text: string;
    date: string;
    icon: "task" | "message";
    texts: Texts;
};

export const ArchivableNotification = ({
    title,
    metadata,
    id,
    text,
    date,
    icon,
    texts,
}: ArchivableNotificationProps) =>
    html`<archivable-notification class="${cls.notification}" data-id="${id}">
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
            <local-time datetime="${date}" class="${cls.date}"></local-time>
        </div>
        <div>${text}</div>
        <div class="${cls.bottom}">
            ${metadata && html`<div class="${cls.metadata}">${metadata}</div>`}
            <button class="${cls.button}">${texts.archive}</button>
        </div>
    </archivable-notification>`;
