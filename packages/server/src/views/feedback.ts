import html from 'decorator-shared/html';

export function Feedback({ texts }: { texts: { did_you_find: string } }) {
  return html`
    <div id="feedback">
      <div class="feedback-content">
        <h2>${texts.did_you_find}</h2>
        <div class="mx-4">
          <div class="button-wrapper small-gap">
            <button
              class="button button-outline wide big-label"
              id="feedback-yes"
            >
              Ja
            </button>
            <button
              class="button button-outline wide big-label"
              id="feedback-no"
            >
              Nei
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
