import { BoostObject, PreferredFilter, conversationCookieName, makeBoostConfig } from 'decorator-shared/boost-config';

import styles from '../styles/chatbot-wrapper.module.css';
import { env, param } from '../params';
import Cookies from 'js-cookie';
import { BoostEnviroment } from 'decorator-shared/params';
import { loadExternalScript, loadedScripts } from '../utils';

class ChatbotWrapper extends HTMLElement {
    button: HTMLButtonElement;
    boost: BoostObject | undefined;

    constructor() {
        super();
        this.button = this.querySelector('button')!;
    }

    connectedCallback() {
        const hasConversation = Cookies.get(conversationCookieName);
        const chatbotParam = window.__DECORATOR_DATA__.params.chatbot;
        const isVisible = hasConversation || chatbotParam;
        const chatbotFlagEnabled = window.__DECORATOR_DATA__.features['dekoratoren.chatbotscript'];

        if (!isVisible || !chatbotFlagEnabled ) {
            return;
        }

        const scriptLoaded = loadedScripts.has(getScriptUrl(env('BOOST_ENVIRONMENT') as BoostEnviroment));

        this.button.addEventListener('click', this.openBoostWindow);

        // Script is already loaded
        if (scriptLoaded) {
            this.showChatbot();
        } else {
            this.loadScript();
        }
    }

    loadScript() {
        if(env('ENV') === 'development') {
            return
        }

        loadExternalScript(getScriptUrl(env('BOOST_ENVIRONMENT') as BoostEnviroment)).then(() => {
            this.showChatbot();
            this.initBoost();
        });
    }

    initBoost() {
        if (typeof window.boostInit === 'undefined') {
            return;
        }

        // @TODO - Write own function and test
        const preferredFilter = getPreferredFilter();

        const boostConfig = makeBoostConfig({
            preferredFilter,
            conversationId: Cookies.get(conversationCookieName),
        });

        this.boost = window.boostInit(env('BOOST_ENVIRONMENT'), boostConfig) as BoostObject;

        this.boost.chatPanel.addEventListener('conversationIdChanged', this.handleConversationIdChanged);
        this.boost.chatPanel.addEventListener('setFilterValue', this.handleSetFilterValue);

    }

    disconnectedCallback() {
        this.boost?.chatPanel.removeEventListener('conversationIdChanged', this.handleConversationIdChanged);
        this.boost?.chatPanel.removeEventListener('setFilterValue', this.handleSetFilterValue);
    }

    openBoostWindow = () => {
        if (typeof this.boost !== 'undefined') {
            this.boost!.chatPanel.show();
        }
    }

    handleConversationIdChanged = (event: any) => {
            if (!event?.detail?.conversationId) {
                Cookies.remove(conversationCookieName);
                return;
            }
            const expirationDay = new Date();
            expirationDay.setHours(expirationDay.getHours() + 1);
            const isProduction = env('ENV') === 'production'

            Cookies.set(conversationCookieName, event.detail.conversationId, {
                expires: expirationDay,
                domain: isProduction ? '.nav.no' : '.dev.nav.no',
            });
    }

    handleSetFilterValue = (event: any) => {
        this.boost?.chatPanel.setFilterValues(event.detail.filterValue);
    }

    showChatbot() {
        const chatbotVisibleParam = window.__DECORATOR_DATA__.params.chatbot;

        if (chatbotVisibleParam) {
            this.button.classList.add(styles.extraVisible);
        }
    }
}

function getPreferredFilter(): PreferredFilter {
    return param('context') === 'arbeidsgiver' ? 'arbeidsgiver' : param('language') === 'nn' ? 'nynorsk' : 'bokmal';
}

function getScriptUrl(boostEnvironment: BoostEnviroment) {
    return `https://${boostEnvironment}.boost.ai/chatPanel/chatPanel.js`;
}

customElements.define('d-chatbot-wrapper', ChatbotWrapper);
