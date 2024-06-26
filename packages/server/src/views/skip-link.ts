import cls from "decorator-client/src/styles/skiplink.module.css";
import html, { Template } from "decorator-shared/html";

export const SkipLink = (text: Template) => html`
    <skip-link
        href="#maincontent"
        class="${cls.skiplink}"
        data-analytics-event-args="${JSON.stringify({
            category: "dekorator-header",
            action: "skiplink",
        })}"
    >
        ${text}
    </skip-link>
`;
