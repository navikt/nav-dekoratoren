import { html } from 'decorator-shared/utils';
import { WarningIcon } from 'decorator-shared/views/icons/warning';

export type Driftsmelding = {
  heading: string;
  url: string;
  urlscope: string[];
};

export function Driftsmeldinger({
  driftsmeldinger = [],
}: {
  driftsmeldinger: Driftsmelding[];
}) {
  // Unsure if this should be hardcoded
  return html` <section id="driftsmeldinger">
    ${driftsmeldinger.map(
      (driftsmelding) => html`
        <a href="https://nav.no${driftsmelding.url}" class="driftsmelding">
          ${WarningIcon()}
          <p>${driftsmelding.heading}</p>
        </a>
      `,
    )}
  </section>`;
}
