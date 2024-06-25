import globalCls from "decorator-client/src/styles/global.module.css";
import html from "decorator-shared/html";
import i18n from "../i18n";
import cls from "../styles/feedback.module.css";

export function FeedbackSuccess() {
    return html`
        <div class="${cls.feedbackSuccess}">
            <h2 class="${cls.feedbackTitle}">
                ${i18n("send_undersokelse_takk")}
            </h2>
            <div>${i18n("hensikt_med_tilbakemelding")}</div>
            <a class="${globalCls["navds-link"]}" href="/kontaktoss">
                ${i18n("hensikt_med_tilbakemelding_lenke")}
            </a>
        </div>
    `;
}
