import html from 'decorator-shared/html';
import { Texts } from 'decorator-shared/types';
import { IconButton } from 'decorator-shared/views/components/icon-button';
import { SearchIcon } from 'decorator-shared/views/icons/search';
import classes from 'decorator-client/src/styles/search.module.css';
import { DropdownMenu } from './dropdown-menu';
import { SearchField } from './search-field';

export const Search = ({ texts }: { texts: Texts }) =>
  DropdownMenu({
    button: IconButton({
      Icon: SearchIcon({
        menuSearch: true,
      }),
      text: texts.search,
      className: classes.searchButton,
    }),
    dropdownClass: classes.dropdown,
    dropdownContent: html`${SearchField({ texts })}
      <div id="search-hits">
        <ul class="${classes.searchHitList}"></ul>
        <div id="show-more"></div>
      </div>`,
  });
