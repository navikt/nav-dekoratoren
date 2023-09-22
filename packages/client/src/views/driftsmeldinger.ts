import html from 'decorator-shared/html';
import { Driftsmelding } from 'decorator-shared/types';
import { WarningIcon } from 'decorator-shared/views/icons/warning';

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

export async function fetchDriftsMeldinger() {
  const data = await fetch(
    `${import.meta.env.VITE_DECORATOR_BASE_URL}/api/driftsmeldinger`,
  );
  const driftsmeldinger = (await data.json()) as Driftsmelding[];

  const header = document.querySelector('.siteheader');

  if (header && driftsmeldinger.length > 0) {
    header.insertAdjacentHTML(
      'afterend',
      Driftsmeldinger({
        driftsmeldinger,
      }),
    );
  }
}
