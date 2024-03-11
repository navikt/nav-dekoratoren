import { erNavDekoratoren } from 'decorator-shared/urls';
import headerClasses from '../styles/header.module.css';
import { tryParse } from 'decorator-shared/json';
import { type AnalyticsEventArgs } from '../analytics/constants';
import { createEvent, CustomEvents } from '../events';
import { Context } from 'decorator-shared/params';
import { CustomLinkElement } from '../helpers/custom-link-element';

class ContextLink extends CustomLinkElement {
    handleActiveContext = (event: CustomEvent<CustomEvents['activecontext']>) => {
        this.anchor.classList.toggle(headerClasses.lenkeActive, this.getAttribute('data-context') === event.detail.context);
    };

    handleClick = (e: MouseEvent) => {
        if (erNavDekoratoren(window.location.href)) {
            e.preventDefault();
        }

        const rawEventArgs = this.getAttribute('data-analytics-event-args');
        const eventArgs = tryParse<AnalyticsEventArgs, null>(rawEventArgs, null);

        this.dispatchEvent(
            createEvent('activecontext', {
                bubbles: true,
                detail: {
                    context: this.getAttribute('data-context') as Context,
                },
            })
        );

        if (eventArgs) {
            const payload = {
                context: window.__DECORATOR_DATA__.params.context,
                ...eventArgs,
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

customElements.define('context-link', ContextLink);
