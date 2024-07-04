import { logAmplitudeEvent } from "../analytics/amplitude";
import { FeedbackSuccess } from "./feedback-success";
import { defineCustomElement } from "../custom-elements";

class DecoratorFeedback extends HTMLElement {
    connectedCallback() {
        this.querySelectorAll("button").forEach((button) =>
            button.addEventListener("click", () => {
                this.innerHTML = FeedbackSuccess().render(
                    window.__DECORATOR_DATA__.params,
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
