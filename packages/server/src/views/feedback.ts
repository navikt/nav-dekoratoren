import clsx from "clsx";
import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/feedback.module.css";
import globalCls from "decorator-client/src/styles/global.module.css";
import html from "decorator-shared/html";
import i18n from "../i18n";
import { Button } from "./components/button";

export const Feedback = ({ contactUrl }: { contactUrl: string }) => html`
    <d-feedback class="${cls.feedback}">
        <div class="${cls.feedbackContent}">
            <h2 class="${cls.feedbackTitle}">${i18n("did_you_find")}</h2>
            <div class="${cls.buttonWrapper}">
                ${Button({
                    content: i18n("yes"),
                    variant: "secondary",
                    attributes: { ["data-svar"]: "ja" },
                })}
                ${Button({
                    content: i18n("no"),
                    variant: "secondary",
                    attributes: { ["data-svar"]: "nei" },
                })}
            </div>
        </div>
        <div class="${clsx(cls.feedbackSuccess, globalCls.hidden)}">
            <h2 class="${cls.feedbackTitle}">
                ${i18n("send_undersokelse_takk")}
            </h2>
            <div>${i18n("hensikt_med_tilbakemelding")}</div>
            <a class="${aksel["navds-link"]}" href="${contactUrl}">
                ${i18n("hensikt_med_tilbakemelding_lenke")}
            </a>
        </div>
    </d-feedback>
`;
