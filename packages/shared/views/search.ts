import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/texts';
import { IconButton } from 'decorator-shared/views/components/icon-button.js';
import { SearchIcon } from 'decorator-shared/views/icons/search';

export default function Search({ texts }: { texts: Texts }) {
  return html`
    <button id="search-button" class="icon-button">
      ${SearchIcon({
        className: 'searchIcon menuSearch',
      })}
      <span class="icon-button-span"> ${texts.search} </span>
    </button>
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
