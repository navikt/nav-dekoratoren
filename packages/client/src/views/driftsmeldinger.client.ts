import {
  Driftsmelding,
  Driftsmeldinger,
} from 'decorator-shared/views/driftsmeldinger';

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
