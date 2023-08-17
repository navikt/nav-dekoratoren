import { html } from '../utils';
import { Texts } from '../texts';
import { IconButton } from './components/icon-button';
import { SearchIcon } from './icons/search';

// All of this can probably be made into a web componetn

export default function Search({ texts }: { texts: Texts }) {
  return html`
    <search-button id="search-button">
      ${SearchIcon({
        slot: 'icon',
      })}
      <span slot="idleText">${texts.search}</span>
      <span slot="openedText">${texts.close}</span>
    </search-button>
    <div id="sok-dropdown">
      <div id="sok-dropdown-content">
        <label for="search-input" class="big-label">Søk på nav.no</label>
        <div class="flex">
          <input id="search-input" type="text" />
          ${IconButton({
            Icon: SearchIcon,
            text: 'Søk',
            className: 'blue-bg-icon',
          })}
        </div>
      </div>
      <div id="search-hits">
        <ul></ul>
        <div id="show-more"></div>
      </div>
    </div>
  `;
}

export function InlineSearchTemplate() {
  return html` <template id="inline-search-template">
    <style></style>
    <div class="inline-search">
      <input id="inline-search-input" class="decorator-input" type="text" />
      <h2>Inline search</h2>
    </div>
  </template>`;
}
