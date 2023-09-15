import { Texts } from '../texts';
import { html } from '../utils';
import { Button } from './components/button.js';

export function Feedback({ texts }: { texts: Texts }) {
  return html`
    <div id="feedback">
      <div class="feedback-content">
        <h2>${texts.did_you_find}</h2>
        <div class="mx-4">
          ${Button({ text: 'Ja' })} ${Button({ text: 'Nei' })}
        </div>
      </div>
      <script></script>
    </div>
  `;
}

export function FeedbackSuccess() {
  return html`
    <div class="text-center">
      <h2>Takk!</h2>
      <p class="my-1">
        Du får dessverre ikke svar på tilbakemeldingen din. Har du spørsmål
        eller trenger du hjelp?
      </p>
      <a class="basic-link my-1" href="/kontaktoss"
        >Ring, chat eller skriv til oss</a
      >
    </div>
  `;
}
