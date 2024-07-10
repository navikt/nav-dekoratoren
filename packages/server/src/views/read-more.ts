import cls from "decorator-client/src/styles/read-more.module.css";
import html, { Template } from "decorator-shared/html";
import { ChevronDownIcon } from "decorator-icons";

export type ReadMoreProps = {
    header: Template;
    content: Template;
};

export const ReadMore = (props: ReadMoreProps) => {
    return html`
        <details class="${cls.details}">
            <summary class="${cls.summary}">
                ${ChevronDownIcon({ className: cls.icon })}
                <div>${props.header}</div>
            </summary>
            <div class="${cls.answer}">${props.content}</div>
        </details>
    `;
};
