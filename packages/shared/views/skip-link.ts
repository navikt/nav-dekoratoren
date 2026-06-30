import cls from "decorator-client/src/styles/skiplink.module.css";
import html, { type Template } from "../html";

export const SkipLink = (text: Template) => html`
    <skip-link>
        <a href="#maincontent" class="${cls.skiplink}">${text}</a>
    </skip-link>
`;
