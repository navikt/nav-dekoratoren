import html from '../html';
import { IconButton } from './components/icon-button';
import { SearchIcon } from './icons/search';
import cls from 'decorator-client/src/styles/search-field.module.css';

export type SearchFieldProps = {
  texts: {
    search_nav_no: string;
    search: string;
  };
};

export const SearchField = ({ texts }: SearchFieldProps) =>
  html` <form>
    <label for="${cls.searchInput}" class="${cls.label}">
      ${texts.search_nav_no}
    </label>
    <div class="${cls.searchInputWrapper}">
      <input class="${cls.searchInput}" type="text" />
      ${IconButton({
        Icon: SearchIcon({}),
        text: texts.search,
        className: cls.blueBgIcon,
      })}
    </div>
  </form>`;
