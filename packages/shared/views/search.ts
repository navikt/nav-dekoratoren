import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { IconButton } from 'decorator-shared/views/components/icon-button';
import { SearchIcon } from 'decorator-shared/views/icons/search';

// @fix typescript error
import utilClasses from 'decorator-client/src/styles/utils.module.css';
import buttonStyles from 'decorator-client/src/styles/buttons.module.css';
import classes from 'decorator-client/src/styles/search.module.css';

export default function Search({ texts }: { texts: Texts }) {
  return html`
    <button class="${buttonStyles.iconButton} ${classes.searchButton}">
      ${SearchIcon({
        className: 'searchIcon',
        menuSearch: true,
      })}
      <span class="${buttonStyles.iconButtonSpan}"> ${texts.search} </span>
    </button>
    <div class="${classes.sokDropdown}">
      <div class="${classes.sokDropdownContent}">
        <label for="${classes.searchInput}" class="${utilClasses.bigLabel}"
          >${texts.sok_knapp_sokefelt}</label
        >
        <div class="${classes.searchInputWrapper}">
          <input class="${classes.searchInput}" type="text" />
          ${IconButton({
            Icon: SearchIcon,
            text: texts.search,
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
