import html from "decorator-shared/html";
import { Alert } from "decorator-shared/views/alert";

// TODO: add texts/translations
export const SearchErrorView = () => {
    return html`${Alert({
        variant: "error",
        content: html` <div>Åh nei, søket feilet!</div>`,
    })}`;
};
