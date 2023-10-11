import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { IconButton } from 'decorator-shared/views/components/icon-button';
import { SearchIcon } from 'decorator-shared/views/icons/search';

// @fix typescript error
import utilClasses from 'decorator-client/src/styles/utils.module.css';
import classes from 'decorator-client/src/styles/search.module.css';

export default function Search({ texts }: { texts: Texts }) {
  return html`
    ${IconButton({
      Icon: SearchIcon({
        menuSearch: true,
      }),
      text: texts.search,
      className: classes.searchButton,
    })}
    <div class="${classes.sokDropdown}">
      <div class="${classes.sokDropdownContent}">
        <label for="${classes.searchInput}" class="${utilClasses.bigLabel}"
          >${texts.sok_knapp_sokefelt}</label
        >
        <div class="${classes.searchInputWrapper}">
          <input class="${classes.searchInput}" type="text" />
          ${IconButton({
            Icon: SearchIcon({}),
            text: texts.search,
            className: classes.blueBgIcon,
          })}
        </div>
      </div>
      <div id="search-hits">
        <ul class="${classes.searchHitList}"></ul>
        <div id="show-more"></div>
      </div>
    </div>
  `;
}
