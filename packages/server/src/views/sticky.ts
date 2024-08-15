import html, { Template } from "decorator-shared/html";
import cls from "decorator-client/src/styles/sticky.module.css";

export function Sticky({ children }: { children: Template }) {
    return html` <d-sticky class="${cls.placeholder}">
        <div class="${cls.absoluteWrapper}">
            <div class="${cls.fixedWrapper}">${children}</div>
        </div>
    </d-sticky>`;
}
