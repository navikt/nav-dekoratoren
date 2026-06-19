import { feedbackSelector } from "decorator-shared/views/feedback";
import utils from "../styles/utils.module.css";
import { defineCustomElement } from "./custom-elements";
import { logAnalyticsEvent } from "../analytics/analytics";

class DecoratorFeedback extends HTMLElement {
    connectedCallback() {
        this.querySelectorAll("button").forEach((button) =>
            button.addEventListener("click", () => {
                this.querySelector(feedbackSelector.content)?.classList.add(
                    utils.hidden,
                );
                this.querySelector(feedbackSelector.success)?.classList.remove(
                    utils.hidden,
                );
                logAnalyticsEvent("tilbakemelding", {
                    kilde: "footer",
                    svar: button.getAttribute("data-svar"),
                });
            }),
        );
    }
}

defineCustomElement("d-feedback", DecoratorFeedback);
