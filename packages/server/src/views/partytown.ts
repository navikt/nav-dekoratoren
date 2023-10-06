import html from 'decorator-shared/html';
import { partytownSnippet } from '@builder.io/partytown/integration';

const snippetText = partytownSnippet({
  lib: '/public/~partytown/',
});

export function Partytown() {
  return html`
    <script>
      partytown = {
        debug: true,
        forward: ['analyticsEventTest'],
      };
    </script>
    <script>
      ${() => snippetText};
    </script>
  `;
}
