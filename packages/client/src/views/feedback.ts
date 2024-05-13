import feedbackClasses from "../styles/feedback.module.css";
import { FeedbackSuccess } from "./feedback-success";
import { logAmplitudeEvent } from "../analytics/amplitude";

class DecoratorFeedback extends HTMLElement {
    connectedCallback() {
        // Feedback
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
                    feedbackContent.innerHTML = FeedbackSuccess({
                        texts: window.__DECORATOR_DATA__.texts,
                    }).render();

                    logAmplitudeEvent("tilbakemelding", {
                        kilde: "footer",
                        svar: answer,
                    });
                }
            });
        });
    }
}

customElements.define("d-feedback", DecoratorFeedback);
