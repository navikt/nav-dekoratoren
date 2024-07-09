import cls from "decorator-client/src/styles/feedback.module.css";
import globalCls from "decorator-client/src/styles/global.module.css";
import { logAmplitudeEvent } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";

class DecoratorFeedback extends HTMLElement {
    connectedCallback() {
        this.querySelectorAll("button").forEach((button) =>
            button.addEventListener("click", () => {
                this.querySelector(`.${cls.feedbackContent}`)?.classList.add(
                    globalCls.hidden,
                );
                this.querySelector(`.${cls.feedbackSuccess}`)?.classList.remove(
                    globalCls.hidden,
                );
                logAmplitudeEvent("tilbakemelding", {
                    kilde: "footer",
                    svar: button.getAttribute("data-svar"),
                });
            }),
        );
    }
}

defineCustomElement("d-feedback", DecoratorFeedback);
