import html from "decorator-shared/html";
import { Alert } from "decorator-shared/views/alert";

// TODO: add texts/translations
export const NotificationsArchiveErrorView = () => {
    return html`${Alert({
        variant: "error",
        content: html` <div>Åh nei, kunne ikke arkivere varselet!</div>`,
    })}`;
};
