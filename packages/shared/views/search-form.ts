import html from '../html';
import { CloseIcon } from './icons';
import { SearchIcon } from './icons/search';
import cls from 'decorator-client/src/styles/search-form.module.css';

export type SearchFormProps = {
  texts: {
    search_nav_no: string;
    search: string;
  };
};

export const SearchForm = ({ texts }: SearchFormProps) => {
  const id = `search-${Math.random()}`;

  return html`<form class="${cls.searchForm}">
    <label class="${cls.label}" for="${id}">${texts.search_nav_no}</label>
    <div class="${cls.searchWrapper}">
      <search-input class="${cls.searchWrapperInner}">
        <input
          class="${cls.searchInput}"
          type="text"
          name="search"
          id="${id}"
        />
        <button type="button" class="${cls.clear}">${CloseIcon({})}</button>
      </search-input>
      <button class="${cls.submit}">${SearchIcon({})}</button>
    </div>
  </form>`;
};
