import html from "decorator-shared/html";

import { FridaIcon } from "decorator-shared/views/icons/frida-icon";

import styles from 'decorator-client/src/styles/chatbot-wrapper.module.css';

export function ChatbotWrapper (visible: boolean) {
    return html`
        <d-chatbot-wrapper class="">
            <button
                id="chatbot-frida-knapp"
                aria-label="Åpne chat"
                class="${styles.chatbot}${visible ? ` ${styles.extraVisible}` : ''}"
            >
                <div class="${styles.chatbotWrapper}">
                        ${FridaIcon()}
                </div>
            </button>
        </d-chatbot-wrapper>
    `;
}
