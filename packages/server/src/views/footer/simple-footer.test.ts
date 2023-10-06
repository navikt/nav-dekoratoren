import { expect, test } from 'bun:test';
import { SimpleFooter } from './simple-footer';

const links = [
  {
    content: 'Personvern og informasjonskapsler',
    url: '/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten',
  },
  {
    content: 'Tilgjengelighet',
    url: '/tilgjengelighet',
  },
];

test('renders simple footer', async () => {
  expect(
    SimpleFooter({
      links,
      texts: {
        share_screen: 'Del skjerm med veileder',
      },
    })(),
  ).toMatchSnapshot();
});
