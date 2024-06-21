import cls from "decorator-client/src/styles/search-form.module.css";
import html from "decorator-shared/html";
import { CloseIcon } from "decorator-shared/views/icons";
import { SearchIcon } from "decorator-shared/views/icons/search";
import i18n from "../i18n";

export const SearchForm = () => {
    const id = `search-${Math.random()}`;

    return html`<form class="${cls.searchForm}">
        <label class="${cls.label}" for="${id}">${i18n("search_nav_no")}</label>
        <div class="${cls.searchWrapper}">
            <search-input class="${cls.searchWrapperInner}">
                <input
                    class="${cls.searchInput}"
                    type="text"
                    name="search"
                    id="${id}"
                    autocomplete="off"
                />
                <button type="button" class="${cls.clear}">
                    ${CloseIcon({ ariaLabel: i18n("clear") })}
                </button>
            </search-input>
            <button class="${cls.submit}">
                ${SearchIcon({ ariaLabel: i18n("search") })}
            </button>
        </div>
    </form>`;
};
