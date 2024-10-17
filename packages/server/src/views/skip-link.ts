import cls from "decorator-client/src/styles/skiplink.module.css";
import html, { Template } from "decorator-shared/html";

export const SkipLink = (text: Template) => html`
    <skip-link>
        <a href="#maincontent" class="${cls.skiplink}">${text}</a>
    </skip-link>
`;
