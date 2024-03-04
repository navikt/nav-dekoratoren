import { erNavDekoratoren } from 'decorator-shared/urls';
import headerClasses from '../styles/header.module.css';
import { tryParse } from 'decorator-shared/json';
import { type AnalyticsEventArgs } from '../analytics/constants';
import { createEvent, CustomEvents } from '../events';
import { Context } from 'decorator-shared/params';

class ContextLink extends HTMLElement {
    private readonly anchor: HTMLAnchorElement;

    constructor() {
        super();

        this.anchor = document.createElement('a');
        this.anchor.href = this.getAttribute('href') || '';
        this.anchor.innerHTML = this.innerHTML;
        this.anchor.classList.add(...this.classList);

        this.classList.remove(...this.classList);

        this.innerHTML = '';
        this.appendChild(this.anchor);
    }

    handleActiveContext = (event: CustomEvent<CustomEvents['activecontext']>) => {
        this.anchor.classList.toggle(headerClasses.lenkeActive, this.getAttribute('data-context') === event.detail.context);
    };

    handleClick = (e: MouseEvent) => {
        if (erNavDekoratoren(window.location.href)) {
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
            })
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

customElements.define('context-link', ContextLink);
