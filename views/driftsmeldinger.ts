import { Driftsmelding } from '@/server/handlers/serviceHandlers';
import { html } from '@/utils';
import { WarningIcon } from '@/views/icons/warning';

export async function fetchDriftsMeldinger() {
  const data = await fetch('/dekoratoren/api/driftsmeldinger');
  const driftsmeldinger = (await data.json()) as Driftsmelding[];

  const header = document.querySelector('.siteheader');

  if (header && driftsmeldinger) {
    header.insertAdjacentHTML(
      'afterend',
      Driftsmeldinger({
        driftsmeldinger,
      }),
    );
  }
}

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
