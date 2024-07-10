import { tryParse } from "decorator-shared/json";
import { amplitudeEvent } from "../analytics/amplitude";
import { type AnalyticsEventArgs } from "../analytics/constants";
import { defineCustomElement } from "../custom-elements";
import { CustomLinkElement } from "../helpers/custom-link-element";
import headerClasses from "../styles/header.module.css";

class ContextLink extends CustomLinkElement {
    handleClick = () => {
        const rawEventArgs = this.getAttribute("data-analytics-event-args");
        const eventArgs = tryParse<AnalyticsEventArgs, null>(
            rawEventArgs,
            null,
        );

        if (eventArgs) {
            const payload = {
                context: window.__DECORATOR_DATA__.params.context,
                ...eventArgs,
            };
            amplitudeEvent(payload);
        }
    };

    handleParamsUpdated = (event: CustomEvent) => {
        if (event.detail.params.context) {
            this.anchor.classList.toggle(
                headerClasses.lenkeActive,
                this.getAttribute("data-context") ===
                    event.detail.params.context,
            );
        }
    };

    connectedCallback() {
        super.connectedCallback();

        this.addEventListener("click", this.handleClick);
        window.addEventListener("paramsupdated", this.handleParamsUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener("paramsupdated", this.handleParamsUpdated);
    }
}

defineCustomElement("context-link", ContextLink);
