import cls from "decorator-client/src/styles/ops-messages.module.css";
import utilsCls from "decorator-client/src/styles/utilities.module.css";
import {
    ExclamationmarkTriangleIcon,
    InformationSquareIcon,
} from "decorator-icons";
import html from "decorator-shared/html";
import { OpsMessage } from "decorator-shared/types";
import { amplitudeClickListener } from "../analytics/amplitude";
import { defineCustomElement } from "../custom-elements";
import { env } from "../params";

export const OpsMessagesTemplate = ({
    opsMessages,
}: {
    opsMessages: OpsMessage[];
}) => html`
    <section class="${cls.opsMessagesContent} ${utilsCls.contentContainer}">
        ${opsMessages.map(
            ({ heading, url, type }) => html`
                <a href="${url}" class="${cls.opsMessage}">
                    ${type === "prodstatus"
                        ? ExclamationmarkTriangleIcon({ className: cls.icon })
                        : InformationSquareIcon({ className: cls.icon })}
                    ${heading}
                </a>
            `,
        )}
    </section>
`;

const exactPathTerminator = "$";

const removeTrailingChars = (url?: string) =>
    url?.replace(`${exactPathTerminator}$`, "").replace(/\/$/, "");

class OpsMessages extends HTMLElement {
    private messages: OpsMessage[] = [];

    connectedCallback() {
        fetch(`${env("APP_URL")}/ops-messages`)
            .then((res) => res.json())
            .then((opsMessages) => {
                this.messages = opsMessages;
                this.render();
            });

        window.addEventListener("historyPush", () => this.render());
        window.addEventListener("popstate", () => this.render());
        this.addEventListener(
            "click",
            amplitudeClickListener(() => ({
                action: "driftsmeldinger",
                category: "dekorator-header",
            })),
        );
    }

    private render() {
        const filteredMessages = this.messages.filter(
            (opsMessage: OpsMessage) => {
                const currentUrl = removeTrailingChars(window.location.href);
                return (
                    !opsMessage.urlscope ||
                    !currentUrl ||
                    opsMessage.urlscope.length === 0 ||
                    opsMessage.urlscope.some((rawUrl) => {
                        const url = removeTrailingChars(rawUrl);
                        return (
                            url &&
                            (rawUrl.endsWith(exactPathTerminator)
                                ? currentUrl === url
                                : currentUrl.startsWith(url))
                        );
                    })
                );
            },
        );

        if (filteredMessages.length === 0) {
            this.removeAttribute("aria-label");
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
