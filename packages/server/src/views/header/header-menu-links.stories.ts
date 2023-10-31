import type { StoryObj, Meta } from '@storybook/html';
import type { HeaderMenuLinksProps } from './header-menu-links';
import { HeaderMenuLinks } from './header-menu-links';

const meta: Meta<HeaderMenuLinksProps> = {
  title: 'header/menu-links',
  tags: ['autodocs'],
  render: (args) => {
    return HeaderMenuLinks(args);
  },
};

export default meta;
type Story = StoryObj<HeaderMenuLinksProps>;

export const Default: Story = {
  args: {
    headerMenuLinks: [
      {
        displayName: 'Områder',
        path: '',
        flatten: true,
        id: '79173ea3-74cd-4d7a-a81f-a43915022c4e',
        children: [
          {
            displayName: 'Arbeid',
            path: '/arbeid',
            id: '433a7fcf-b5d4-47fa-b07b-2b388a968129',
            children: [],
          },
          {
            displayName: 'Helse og sykdom',
            path: '/helse',
            id: 'c0379053-4fdf-4151-8974-5d475449ebd2',
            children: [],
          },
          {
            displayName: 'Familie og barn',
            path: '/familie',
            id: 'e79dd1e5-e647-46a7-8387-a9a652ed022f',
            children: [],
          },
          {
            displayName: 'Pensjon',
            path: '/pensjon',
            id: '721f8cdb-f41b-4250-b7ea-f36f5bb2a558',
            children: [],
          },
          {
            displayName: 'Sosiale tjenester og veiledning',
            path: '/sosiale-tjenester',
            id: '67047b4c-9aad-403b-b86a-f86c439c5b7d',
            children: [],
          },
          {
            displayName: 'Hjelpemidler og tilrettelegging',
            path: '/hjelpemidler',
            id: '77c95b52-c6df-4d21-96f9-980b29bc4528',
            children: [],
          },
        ],
      },
      {
        displayName: 'Snarveier',
        path: '',
        flatten: false,
        id: 'c73650df-2e69-41e3-ae15-96ed90de4b0b',
        children: [
          {
            displayName: 'Søknad og skjema',
            path: '/soknader',
            flatten: false,
            id: '63294b4d-01e4-497b-b34c-ccdf0df3edf4',
            children: [],
          },
          {
            displayName: 'Ettersendelse',
            path: '/ettersende',
            flatten: false,
            id: 'a0f95de4-92a5-44f4-a361-65f7452fee06',
            children: [],
          },
          {
            displayName: 'Klage',
            path: '/klage',
            flatten: false,
            id: 'de30686a-5d55-4188-a735-bd0f5e6abab2',
            children: [],
          },
          {
            displayName: 'Pengestøtter og tjenester fra A til Å',
            path: '/tjenester',
            id: '4077b31a-0b92-48da-ac65-ec7f799b0aca',
            children: [],
          },
          {
            displayName: 'Saksbehandlingstider',
            path: '/saksbehandlingstider',
            id: '4d10e55b-ed4f-492a-9f07-dc8413f1ff7c',
            children: [],
          },
          {
            displayName: 'Utbetalinger',
            path: '/no/nav-og-samfunn/kontakt-nav/utbetalinger/utbetalinger',
            id: 'b3a2b780-1243-41b1-bd63-e47f014762a4',
            children: [],
          },
          {
            displayName: 'Satser',
            path: '/satser',
            flatten: false,
            id: '799aa2bd-3010-49f6-bd40-7a96d3ed1e98',
            children: [],
          },
          {
            displayName: 'Meldekort',
            path: '/no/person/arbeid/dagpenger-ved-arbeidsloshet-og-permittering/meldekort-hvordan-gjor-du-det',
            id: 'bcd4d2ab-de95-4904-9cf2-476652dd0150',
            children: [],
          },
          {
            displayName: 'Kurs fra NAV',
            path: '/no/nav-og-samfunn/kontakt-nav/kurs-fra-nav',
            id: 'e0b328f5-f509-4fd8-879d-79679b3b1667',
            children: [],
          },
          {
            displayName: 'Feiltolkning av EØS-reglene',
            path: '/no/nav-og-samfunn/kontakt-nav/feiltolkning-av-eos-reglene',
            flatten: false,
            id: '0ef10379-91d0-4be6-abb2-75be206b1ad1',
            children: [],
          },
        ],
      },
    ],
  },
};
