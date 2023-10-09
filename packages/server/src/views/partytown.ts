import html, { unsafeHtml } from 'decorator-shared/html';
import { partytownSnippet } from '@builder.io/partytown/integration';

const snippetText = partytownSnippet({
  lib: '/public/~partytown/',
  forward: ['analyticsEvent', 'logAmplitudeEvent', 'logPageView'],
});

export function Partytown() {
  return html`
    <script>
      partytown = {
        debug: true,
        // Metoder som skal videresendes til partytown
        forward: ['analyticsEvent', 'logAmplitudeEvent', 'logPageView'],
      };
    </script>
    <script>
      ${unsafeHtml(snippetText)};
    </script>
  `;
}
