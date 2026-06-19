import cls from "decorator-client/src/styles/search-form.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { MagnifyingGlassIcon, XMarkIcon } from "decorator-icons";
import html, { type Template } from "../html";
import { defineHydrationHooks, hydrateAttr } from "../hydration";

export const [searchFormHook, searchFormSelector] = defineHydrationHooks({
    form: "search.form",
    input: "search.input",
    clear: "search.clear",
});

export type SearchFormProps = {
    searchNavNoLabel: Template;
    clearLabel: Template;
    searchLabel: Template;
};

export const SearchForm = ({
    searchNavNoLabel,
    clearLabel,
    searchLabel,
}: SearchFormProps) => {
    const id = `search-${Math.random()}`;

    return html`<form
        class="${cls.searchForm}"
        ${hydrateAttr(searchFormHook.form)}
    >
        <label class="${cls.label}" for="${id}">${searchNavNoLabel}</label>
        <div class="${cls.searchWrapper}">
            <search-input class="${cls.searchWrapperInner}">
                <input
                    class="${cls.searchInput}"
                    ${hydrateAttr(searchFormHook.input)}
                    type="text"
                    name="search"
                    maxlength="100"
                    id="${id}"
                    autocomplete="off"
                />
                <button
                    type="button"
                    class="${cls.clear} ${utils.hidden}"
                    ${hydrateAttr(searchFormHook.clear)}
                >
                    ${XMarkIcon({ ariaLabel: clearLabel })}
                </button>
            </search-input>
            <button class="${cls.submit}">
                ${MagnifyingGlassIcon({
                    ariaLabel: searchLabel,
                    className: utils.icon,
                })}
            </button>
        </div>
    </form>`;
};
