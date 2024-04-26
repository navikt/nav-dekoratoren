import html, { unsafeHtml } from "decorator-shared/html";
import { partytownSnippet } from "@builder.io/partytown/integration";

export const partytownConfig = {
    lib: `/public/~partytown/`,
    debug: true,
    forward: [
        "analyticsEvent",
        "logAmplitudeEvent",
        "logPageView",
        "startTaskAnalyticsSurvey",
    ],
};

const snippetText = partytownSnippet(partytownConfig);

export function Partytown() {
    return html`
        <script>
            ${unsafeHtml(snippetText)};
        </script>
    `;
}
