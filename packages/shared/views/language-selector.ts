import { AvailableLanguage } from 'decorator-shared/params';
import html from '../html';

export default ({
  availableLanguages,
}: {
  availableLanguages: AvailableLanguage[];
}) =>
  availableLanguages.length > 0
    ? html`
        <language-selector id="language-selector" class="sprakvelger">
          <button>
            <span lang="nb">Språk</span>/<span lang="en">Language</span>
          </button>
          <script type="application/json">
            ${JSON.stringify(availableLanguages)}
          </script>
        </language-selector>
      `
    : null;
