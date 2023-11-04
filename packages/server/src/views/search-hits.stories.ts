import type { StoryObj, Meta } from '@storybook/html';
import type { SearchHitsProps } from './search-hits';
import { SearchHits } from './search-hits';
import { texts } from '../texts';

const meta: Meta<SearchHitsProps> = {
  title: 'search/search-hits',
  render: SearchHits,
};

export default meta;
type Story = StoryObj<SearchHitsProps>;

export const Default: Story = {
  args: {
    results: {
      total: 652,
      hits: [
        {
          displayName: 'Arbeid med støtte',
          href: 'https://www.nav.no/arbeid-med-stotte',
          highlight:
            'Et tilbud for deg som trenger støtte for å skaffe eller beholde en jobb. ',
        },
        {
          displayName: 'Gradert sjukmelding',
          href: 'https://www.nav.no/gradert-sjukmelding/nn',
          highlight:
            'Dersom du kan vere delvis i arbeid, skal du bli delvis sjukmeld. Føremålet er at du skal halde kontakten med arbeidsplassen og kunne jobbe når det er mogleg. Vilkåret er at det er medisinsk (...)',
        },
        {
          displayName: 'Kva er NAV?',
          href: 'https://www.nav.no/hva-er-nav/nn',
          highlight:
            'Om kva NAV er, korleis vi er organiserte, og korleis vi jobbar for å løyse samfunnsoppdraget vårt.',
        },
        {
          displayName: 'Varig tilrettelagt arbeid',
          href: 'https://www.nav.no/arbeidsgiver/varig-tilrettelagt-arbeid',
          highlight:
            'Hvis en person får uføretrygd, men har mulighet til å gjøre tilpassede oppgaver, kan det være aktuelt med varig tilrettelagt arbeid i ordinær virksomhet.',
        },
        {
          displayName: 'Opplysning, råd og rettleiing',
          href: 'https://www.nav.no/opplysning-rad-rettleiing/nn',
          highlight:
            'Rettleiing frå NAV når du har utfordringar med heimeforhold, busituasjon, omsorg for barn, arbeid eller økonomi.',
        },
      ],
    },
    query: 'arbeid',
    texts: texts.nb,
  },
};
