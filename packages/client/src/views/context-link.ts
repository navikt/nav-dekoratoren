import { erNavDekoratoren } from 'decorator-shared/urls';
import headerClasses from '../styles/header.module.css';
import { tryParse } from 'decorator-shared/json';
import { type AnalyticsEventArgs } from '../analytics/constants';
import { createEvent } from '../events';
import { Context } from 'decorator-shared/params';

class ContextLink extends HTMLAnchorElement {
    handleActiveContext = (event: Event) => {
        this.classList.toggle(
            headerClasses.lenkeActive,
            this.getAttribute('data-context') === (event as CustomEvent<{ context: string }>).detail.context,
        );
    };

    handleClick = (e: MouseEvent) => {
        console.log('Clicked!');

        if (erNavDekoratoren(window.location.href)) {
            console.log('Er dekoratøren');
            e.preventDefault();
        }

        const rawEventArgs = this.getAttribute('data-analytics-event-args');
        const eventArgs = tryParse<AnalyticsEventArgs, null>(rawEventArgs, null);
        const attachContext = this.getAttribute('data-attach-context') === 'true';

        this.dispatchEvent(
            createEvent('activecontext', {
                bubbles: true,
                detail: {
                    context: this.getAttribute('data-context') as Context,
                },
            }),
        );

        if (eventArgs) {
            const payload = {
                ...eventArgs,
                ...(attachContext && {
                    context: window.__DECORATOR_DATA__.params.context,
                }),
            };
            window.analyticsEvent(payload);
        }
    };

    connectedCallback() {
        window.addEventListener('activecontext', this.handleActiveContext);
        this.addEventListener('click', this.handleClick);
    }

    disconnectedCallback() {
        window.removeEventListener('activecontext', this.handleActiveContext);
    }
}

customElements.define('context-link', ContextLink, { extends: 'a' });
