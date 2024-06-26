import cls from "decorator-client/src/styles/read-more.module.css";
import html, { Template } from "../../../shared/html";
import { DownChevronIcon } from "../../../shared/views/icons";

export type ReadMoreProps = {
    header: Template;
    content: Template;
};

export const ReadMore = (props: ReadMoreProps) => {
    return html`
        <details class="${cls.details}">
            <summary class="${cls.summary}">
                ${DownChevronIcon({ className: cls.icon })}
                <div>${props.header}</div>
            </summary>
            <div class="${cls.answer}">${props.content}</div>
        </details>
    `;
};
