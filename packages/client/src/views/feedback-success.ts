import globalCls from "decorator-client/src/styles/global.module.css";
import html from "decorator-shared/html";
import type { ClientTexts } from "decorator-shared/types";
import cls from "../styles/feedback.module.css";

type FeedbackSuccessProps = {
    texts: ClientTexts;
};

export function FeedbackSuccess({ texts }: FeedbackSuccessProps) {
    return html`
        <div class="${cls.feedbackSuccess}">
            <h2 class="${cls.feedbackTitle}">
                ${texts.send_undersokelse_takk}
            </h2>
            <div>${texts.hensikt_med_tilbakemelding}</div>
            <a class="${globalCls.link}" href="/kontaktoss">
                ${texts.hensikt_med_tilbakemelding_lenke}
            </a>
        </div>
    `;
}
