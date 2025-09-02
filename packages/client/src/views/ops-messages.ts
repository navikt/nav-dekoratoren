import cls from "decorator-client/src/styles/ops-messages.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import {
    ExclamationmarkTriangleIcon,
    InformationSquareIcon,
} from "decorator-icons";
import html from "decorator-shared/html";
import { OpsMessage } from "decorator-shared/types";
import { endpointUrlWithParams } from "../helpers/urls";
import { defineCustomElement } from "./custom-elements";
import { analyticsClickListener } from "../analytics/analytics";

export const OpsMessagesTemplate = ({
    opsMessages,
}: {
    opsMessages: OpsMessage[];
}) => html`
    <section class="${cls.opsMessagesContent} ${utils.contentContainer}">
        ${opsMessages.map(
            ({ heading, url, type }) => html`
                <a href="${url}" class="${cls.opsMessage}">
                    ${type === "prodstatus"
                        ? ExclamationmarkTriangleIcon({ className: utils.icon })
                        : InformationSquareIcon({ className: utils.icon })}
                    ${heading}
                </a>
            `,
        )}
    </section>
`;

// If the scoped url of a message ends with a literal "$"
// it should only be shown on that exact url
const removeTrailingChars = (url: string) =>
    url.replace(/\$$/, "").replace(/\/$/, "");

class OpsMessages extends HTMLElement {
    private messages: OpsMessage[] = [];

    connectedCallback() {
        fetch(endpointUrlWithParams("/ops-messages"))
            .then((res) => res.json())
            .then((opsMessages) => {
                this.messages = opsMessages;
                this.render();
            });

        window.addEventListener("historyPush", () => {
            this.render();
        });
        window.addEventListener("popstate", () => {
            this.render();
        });
        this.addEventListener(
            "click",
            analyticsClickListener(() => ({
                kategori: "dekorator-driftsmeldinger",
                lenketekst: "driftsmelding",
                komponent: "OpsMessages",
                sideskrolling: window.scrollY ?? 0,
            })),
        );
    }

    private render() {
        const filteredMessages = this.messages.filter(
            (opsMessage: OpsMessage) => {
                const currentUrl = removeTrailingChars(window.location.href);

                return (
                    !opsMessage.urlscope ||
                    opsMessage.urlscope.length === 0 ||
                    opsMessage.urlscope.some((rawScopedUrl) => {
                        const scopedUrl = removeTrailingChars(rawScopedUrl);
                        return rawScopedUrl.endsWith("$")
                            ? currentUrl === scopedUrl
                            : currentUrl.startsWith(scopedUrl);
                    })
                );
            },
        );

        if (filteredMessages.length === 0) {
            this.removeAttribute("aria-label");
            this.innerHTML = "";
            return;
        }

        this.setAttribute(
            "aria-label",
            window.__DECORATOR_DATA__.texts.important_info,
        );

        this.innerHTML = OpsMessagesTemplate({
            opsMessages: filteredMessages,
        }).render(window.__DECORATOR_DATA__.params);
    }
}

defineCustomElement("ops-messages", OpsMessages);
