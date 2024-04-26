import html, { Template } from "decorator-shared/html";
import cls from "decorator-client/src/styles/notification.module.css";
import { Texts } from "decorator-shared/types";

export type ArchivableNotificationProps = {
    title: string;
    metadata?: string;
    id: string;
    text: string;
    date: string;
    icon: Template;
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
                ${icon}
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
