import html from 'decorator-shared/html';
import { Driftsmelding } from 'decorator-shared/types';
import { WarningIcon } from 'decorator-shared/views/icons/warning';

import cls from '../styles/driftsmeldinger.module.css';
import headerClasses from '../styles/header.module.css';

export type DriftsmeldingerProps = {
  driftsmeldinger: Driftsmelding[];
};

export function Driftsmeldinger({
  driftsmeldinger = [],
}: DriftsmeldingerProps) {
  // Unsure if this should be hardcoded
  return html` <section class="${cls.driftsmeldinger}">
    ${driftsmeldinger.map(
      (driftsmelding) => html`
        <a
          href="https://nav.no${driftsmelding.url}"
          class="${cls.driftsmeldingLink}"
        >
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

  const header = document.querySelector(`.${headerClasses.siteheader}`);

  if (header && driftsmeldinger.length > 0) {
    header.insertAdjacentHTML(
      'afterend',
      Driftsmeldinger({
        driftsmeldinger,
      }).render(),
    );
  }
}
