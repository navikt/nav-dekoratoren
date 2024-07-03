import feedbackClasses from "../styles/feedback.module.css";
import { FeedbackSuccess } from "./feedback-success";
import { logAmplitudeEvent } from "../analytics/amplitude";
import { addCustomElement } from "../custom-elements";

class DecoratorFeedback extends HTMLElement {
    connectedCallback() {
        const buttons = document.querySelectorAll(
            `.${feedbackClasses.feedbackContent} button`,
        );

        buttons.forEach((button) => {
            button.addEventListener("click", async () => {
                const feedbackContent = document.querySelector(
                    `.${feedbackClasses.feedbackContent}`,
                );

                const answer = button.getAttribute("data-answer");

                if (feedbackContent) {
                    feedbackContent.innerHTML = FeedbackSuccess().render(
                        window.__DECORATOR_DATA__.params,
                    );

                    logAmplitudeEvent("tilbakemelding", {
                        kilde: "footer",
                        svar: answer,
                    });
                }
            });
        });
    }
}

addCustomElement("d-feedback", DecoratorFeedback);
