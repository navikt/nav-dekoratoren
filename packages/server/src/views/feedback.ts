import html from 'decorator-shared/html';
import { Button } from 'decorator-shared/views/components/button';

export function Feedback({ texts }: { texts: { did_you_find: string } }) {
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
