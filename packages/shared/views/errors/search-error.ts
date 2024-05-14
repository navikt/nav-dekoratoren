import html from "../../html";
import { Alert } from "../alert";

// TODO: add texts/translations
export const SearchErrorView = () => {
    return html`${Alert({
        variant: "error",
        content: html`<div>Åh nei, søket feilet!</div>`,
    })}`;
};
