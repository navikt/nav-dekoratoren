import { erNavDekoratoren } from '../helpers/urls';
import headerClasses from '../styles/header.module.css';
import { tryParse } from 'decorator-shared/json';
import { type AnalyticsEventArgs } from '../analytics/constants';

class ContextLink extends HTMLElement {
    handleActiveContext = (event: Event) =>
        this.classList.toggle(
            headerClasses.lenkeActive,
            this.getAttribute('data-context') === (event as CustomEvent<{ context: string }>).detail.context
        );

    connectedCallback() {
        const attachContext = this.getAttribute('data-attach-context') === 'true';
        const rawEventArgs = this.getAttribute('data-analytics-event-args');
        const eventArgs = tryParse<AnalyticsEventArgs, null>(rawEventArgs, null);

        window.addEventListener('activecontext', this.handleActiveContext);

        this.addEventListener('click', (e) => {
            if (erNavDekoratoren()) {
                e.preventDefault();
            }

            this.dispatchEvent(
                new CustomEvent('activecontext', {
                    bubbles: true,
                    detail: {
                        context: this.getAttribute('data-context'),
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
        });
    }

    disconnectedCallback() {
        window.removeEventListener('activecontext', this.handleActiveContext);
    }
}

customElements.define('context-link', ContextLink);
