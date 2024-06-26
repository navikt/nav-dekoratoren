import cls from "decorator-client/src/styles/feedback.module.css";
import html from "decorator-shared/html";
import { Button } from "decorator-shared/views/components/button";
import i18n from "../i18n";

export const Feedback = () => html`
    <d-feedback class="${cls.feedback}">
        <div class="${cls.feedbackContent}">
            <h2 class="${cls.feedbackTitle}">${i18n("did_you_find")}</h2>
            <div class="${cls.buttonWrapper}">
                ${Button({
                    text: i18n("yes"),
                    variant: "outline",
                    wide: true,
                    bigLabel: true,
                    id: "feedback-yes",
                    data: { answer: i18n("yes") },
                })}
                ${Button({
                    text: i18n("no"),
                    variant: "outline",
                    wide: true,
                    bigLabel: true,
                    id: "feedback-no",
                    data: { answer: i18n("no") },
                })}
            </div>
        </div>
    </d-feedback>
`;
