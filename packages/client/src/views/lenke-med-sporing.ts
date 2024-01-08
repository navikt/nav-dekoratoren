import type { AnalyticsEventArgs } from '../analytics/constants';
import { tryParse } from 'decorator-shared/json';

export class LenkeMedSporingElement extends HTMLElement {
    constructor() {
        super();

        const attachContext = this.getAttribute('data-attach-context') === 'true';
        const rawEventArgs = this.getAttribute('data-analytics-event-args');
        const eventArgs = tryParse<AnalyticsEventArgs, null>(rawEventArgs, null);

        const a = document.createElement('a');
        a.href = this.getAttribute('href') || '';
        a.innerHTML = this.innerHTML;
        a.classList.add(...this.classList);

        this.innerHTML = '';
        this.appendChild(a);

        this.addEventListener('click', (e) => {
            e.preventDefault();

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
}

customElements.define('lenke-med-sporing', LenkeMedSporingElement);

/*
 * Definerer en helper funksjon for rendering siden det er mange paramtere som er viktig at typesjekkes
 * */
