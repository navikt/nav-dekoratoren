import html, { unsafeHtml } from 'decorator-shared/html';
import { partytownSnippet } from '@builder.io/partytown/integration';

const snippetText = partytownSnippet();

export function Partytown() {
  return html`
    <script>
      partytown = {
        debug: true,
        lib: '/public/~partytown/',
        forward: [
          'analyticsEvent',
          'logAmplitudeEvent',
          'logPageView',
          'startTaskAnalyticsSurvey',
        ],
      };
    </script>
    <script>
      ${unsafeHtml(snippetText)};
    </script>
  `;
}
