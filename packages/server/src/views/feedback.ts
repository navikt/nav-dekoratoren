import cls from "decorator-client/src/styles/feedback.module.css";
import html from "decorator-shared/html";
import { Button } from "./button";
import i18n from "../i18n";

export const Feedback = () => html`
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
    </d-feedback>
`;
