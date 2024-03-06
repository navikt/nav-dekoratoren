import type { AnalyticsEventArgs } from '../analytics/constants';
import { tryParse } from 'decorator-shared/json';
import { CustomLinkElement } from '../helpers/custom-link-element';

export class LenkeMedSporingElement extends CustomLinkElement {
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
