import { addCustomElement } from "../custom-elements";

class LocalTime extends HTMLElement {
    connectedCallback() {
        const datetime = this.getAttribute("datetime");
        if (datetime) {
            this.innerHTML = new Date(datetime).toLocaleDateString(
                window.__DECORATOR_DATA__.params.language,
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                },
            );
        }
    }
}

addCustomElement("local-time", LocalTime);
