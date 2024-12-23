import cls from "decorator-client/src/styles/read-more.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import html, { Template } from "decorator-shared/html";
import { ChevronDownIcon } from "decorator-icons";
import clsx from "clsx";

export type ReadMoreProps = {
    header: Template;
    content: Template;
};

export const ReadMore = (props: ReadMoreProps) => {
    return html`
        <details class="${cls.details}">
            <summary class="${cls.summary}">
                ${ChevronDownIcon({ className: clsx(cls.icon, utils.icon) })}
                <span>${props.header}</span>
            </summary>
            <div class="${cls.answer}">${props.content}</div>
        </details>
    `;
};
