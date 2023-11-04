import { expect, test } from 'bun:test';
import { SimpleFooter } from './simple-footer';
import UnleashService from '../../unleash-service';
import { texts } from '../../texts';

const unleashService = new UnleashService({ mock: true });

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
      texts: texts.nb,
      features: unleashService.getFeatures(),
    }).render(),
  ).toMatchSnapshot();
});
