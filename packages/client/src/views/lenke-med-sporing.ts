import type { AnalyticsEventArgs } from '../analytics/constants';
import { tryParse } from 'decorator-shared/json';
import { CustomLinkComponent } from '../helpers/custom-link-component';

export class LenkeMedSporingElement extends CustomLinkComponent {
    constructor() {
        super();

        const attachContext = this.getAttribute('data-attach-context') === 'true';
        const rawEventArgs = this.getAttribute('data-analytics-event-args');
        const eventArgs = tryParse<AnalyticsEventArgs, null>(rawEventArgs, null);

        this.addEventListener('click', () => {
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
