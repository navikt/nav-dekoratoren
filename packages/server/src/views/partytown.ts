import html, { unsafeHtml } from 'decorator-shared/html';
import { partytownSnippet } from '@builder.io/partytown/integration';
import { env } from '../env/server';


const snippetText = partytownSnippet();

export function Partytown() {
  return html`
    <script>
      partytown = {
        lib: '${env.HOST}/public/~partytown/',
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
