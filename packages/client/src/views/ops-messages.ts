import cls from 'decorator-client/src/styles/ops-messages.module.css';
import utilsCls from 'decorator-client/src/styles/utilities.module.css';
import html from 'decorator-shared/html';
import { OpsMessage } from 'decorator-shared/types';
import { InfoIcon, WarningIcon } from 'decorator-shared/views/icons';

export const OpsMessagesTemplate = ({ opsMessages }: { opsMessages: OpsMessage[] }) => html`
    <section class="${cls.opsMessagesContent} ${utilsCls.contentContainer}">
        ${opsMessages.map(
            ({ heading, url, type }) =>
                html`<lenke-med-sporing
                    data-analytics-event-args="${JSON.stringify({
                        category: 'dekorator-header',
                        action: 'driftsmeldinger',
                        label: url,
                    })}"
                    href="${url}"
                    class="${cls.opsMessage}"
                >
                    ${type === 'prodstatus' ? WarningIcon() : InfoIcon()}
                    <span>${heading}</span>
                </lenke-med-sporing>`
        )}
    </section>
`;

const removeTrailingChars = (url?: string) => url?.replace(/(\/|\$|(\/\$))$/, '');

class OpsMessages extends HTMLElement {
    connectedCallback() {
        if (!this.innerHTML) {
            fetch(`${window.__DECORATOR_DATA__.env.APP_URL}/ops-messages`)
                .then((res) => res.json())
                .then((opsMessages) => {
                    if (opsMessages.length > 0) {
                        this.setAttribute('aria-label', window.__DECORATOR_DATA__.texts.important_info);
                        this.innerHTML = OpsMessagesTemplate({
                            opsMessages: opsMessages.filter((opsMessage: OpsMessage) => {
                                const currentUrl = removeTrailingChars(window.location.href);
                                return (
                                    !opsMessage.urlscope ||
                                    !currentUrl ||
                                    opsMessage.urlscope.length === 0 ||
                                    opsMessage.urlscope.some((rawUrl) => {
                                        const url = removeTrailingChars(rawUrl);
                                        return url && (rawUrl.endsWith('$') ? currentUrl === url : currentUrl.startsWith(url));
                                    })
                                );
                            }),
                        }).render();
                    } else {
                        this.removeAttribute('aria-label');
                    }
                });
        }
    }
}

customElements.define('ops-messages', OpsMessages);
