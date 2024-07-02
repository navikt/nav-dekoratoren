import type { AnalyticsEventArgs } from "../analytics/constants";
import { tryParse } from "decorator-shared/json";
import { CustomLinkElement } from "../helpers/custom-link-element";
import { amplitudeEvent } from "../analytics/amplitude";

export class LenkeMedSporingElement extends CustomLinkElement {
    connectedCallback() {
        const rawEventArgs = this.getAttribute("data-analytics-event-args");
        const eventArgs = tryParse<AnalyticsEventArgs, null>(
            rawEventArgs,
            null,
        );

        if (eventArgs) {
            this.addEventListener("click", () => {
                const payload = {
                    context: window.__DECORATOR_DATA__.params.context,
                    ...eventArgs,
                };
                amplitudeEvent(payload);
            });
        }
    }
}

customElements.define("lenke-med-sporing", LenkeMedSporingElement);
