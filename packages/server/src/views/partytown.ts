import html, { unsafeHtml } from 'decorator-shared/html';
import { partytownSnippet } from '@builder.io/partytown/integration';

const snippetText = partytownSnippet({
  lib: '/public/~partytown/',
  logSetters: true,
  debug: true,
  // forward: ['analyticsEvent', 'logAmplitudeEvent', 'logPageView'],
});

export function Partytown() {
  return html`
    <script>
      partytown = {
        debug: true,
        lib: '/public/~partytown/',
        // Metoder som skal videresendes til partytown
        forward: ['analyticsEvent', 'logAmplitudeEvent', 'logPageView'],
      };
    </script>
    <script>
      ${unsafeHtml(snippetText)};
    </script>
  `;
}
