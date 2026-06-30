import { SearchForm as SharedSearchForm } from "decorator-shared/views/search-form";
import i18n from "../i18n";

export const SearchForm = () =>
    SharedSearchForm({
        searchNavNoLabel: i18n("search_nav_no"),
        clearLabel: i18n("clear"),
        searchLabel: i18n("search"),
    });
