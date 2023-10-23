import { Texts } from 'decorator-shared/types';
import feedbackClasses from '../styles/feedback.module.css';
import { ClientRenderer } from '../render'
import html from 'decorator-shared/html'

export function addFeedbackListener({ texts }: { texts: Texts }) {
  const renderer = new ClientRenderer(window.__DECORATOR_DATA__.params.language)

  // Feedback
  const buttons = document.querySelectorAll(
    `.${feedbackClasses.feedbackContent} button`,
  );

  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const feedbackContent = document.querySelector(
        `.${feedbackClasses.feedbackContent}`,
      );

      const answer = button.getAttribute('data-answer');

      if (feedbackContent) {
        await renderer.swap({
            target: `.${feedbackClasses.feedbackContent}`,
            template: 'feedback-success',
            },
            // Eksempel for å få den til å feile med vilje
            // { texts: 3 },
            { texts },
            { fallback: (error) => html`
                <div>
                <h2>Her skjedde det noe feil</h2>
                ${error.message}
                </div>
                ` }
        )

        window.logAmplitudeEvent('tilbakemelding', {
          kilde: 'footer',
          svar: answer,
        });
      }
    });
  });
}
