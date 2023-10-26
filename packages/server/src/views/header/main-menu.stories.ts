import type { StoryObj, Meta } from '@storybook/html';
import type { MainMenuProps } from './main-menu';
import { MainMenu } from './main-menu';
import { texts } from '../../texts';

const meta: Meta<MainMenuProps> = {
  title: 'header/main-menu',
  tags: ['autodocs'],
  render: MainMenu,
};

export default meta;
type Story = StoryObj<MainMenuProps>;

export const Privatperson: Story = {
  args: {
    title: 'Hva kan vi hjelpe deg med?',
    texts: texts.nb,
    homeUrl: '/',
    links: [
      {
        heading: 'Områder',
        children: [
          { content: 'Arbeid', url: '/#' },
          { content: 'Helse og sykdom', url: '/#' },
          { content: 'Familie og barn', url: '/#' },
          { content: 'Pensjon', url: '/#' },
          { content: 'Sosiale tjenester og veiledning', url: '/#' },
          { content: 'Hjelpemidler og tilrettelegging', url: '/#' },
        ],
      },
      {
        heading: 'Snarveier',
        children: [
          { content: 'Søknad og skjema', url: '/#' },
          { content: 'Ettersendelse', url: '/#' },
          { content: 'Klage', url: '/#' },
          { content: 'Pengestøtter og tjenester fra A til Å', url: '/#' },
          { content: 'Saksbehandlingstider', url: '/#' },
          { content: 'Utbetalinger', url: '/#' },
          { content: 'Satser', url: '/#' },
          { content: 'Meldekort', url: '/#' },
          { content: 'Registrer deg som arbeidssøker', url: '/#' },
          { content: 'Kurs fra NAV', url: '/#' },
          { content: 'Feiltolkning av EØS-reglene', url: '/#' },
        ],
      },
    ],
    contextLinks: [
      {
        content: 'Min side',
        url: '/min-side',
      },

      {
        content: 'Arbeidsgiver',
        url: '/arbeidsgiver',
      },
      {
        content: 'Samarbeidspartner',
        url: '/samarbeidspartner',
      },
    ],
  },
};

export const Arbeidsgiver: Story = {
  args: {
    title: 'Arbeidsgiver',
    texts: texts.nb,
    homeUrl: '/',
    links: [
      {
        heading: 'Sykdom, skade og fravær',
        children: [
          { content: 'Ansatt er sykmeldt', url: '/#' },
          {
            content: 'Vil redusere sykefravær og beholde ansatte i jobb',
            url: '/#',
          },
          {
            content: 'Ansatt har blitt syk eller skadet på arbeidsplassen',
            url: '/#',
          },
          { content: 'Ansatt har sykdom i familien', url: '/#' },
          { content: 'Ansatt venter barn', url: '/#' },
          { content: 'Sykefraværsstatistikk', url: '/#' },
        ],
      },
      {
        heading: 'Rekruttere og inkludere',
        children: [
          { content: 'Annonser stillinger eller finn kandidater', url: '/#' },
          { content: 'Vil hjelpe flere inn i arbeidslivet', url: '/#' },
          { content: 'Vil rekruttere', url: '/#' },
          { content: 'Lønnstilskudd', url: '/#' },
        ],
      },
      {
        heading: 'Permittere og nedbemanne',
        children: [
          { content: 'Meld fra til NAV', url: '/#' },
          { content: 'Permittere eller nedbemanne', url: '/#' },
        ],
      },
      {
        heading: 'Skjemaer, tilganger og refusjoner',
        children: [
          { content: 'Søknad og skjema', url: '/#' },
          { content: 'Saksbehandlingstider', url: '/#' },
          { content: 'Klage', url: '/#' },
          { content: 'Altinn-rettigheter til NAVs tjenester', url: '/#' },
          { content: 'Inntektsmelding, rapporter m.m.', url: '/#' },
          { content: 'Forsikring for næringsdrivende m.fl.', url: '/#' },
          { content: 'Aa-registeret', url: '/#' },
        ],
      },
    ],
    contextLinks: [
      {
        content: 'Min side - arbeidsgiver',
        description: 'Dine sykmeldte, rekruttering, digitale skjemaer',
        url: '/min-side',
      },

      {
        content: 'Privat',
        description:
          'Dine saker, utbetalinger, meldinger, meldekort, aktivitetsplan, personopplysninger og flere tjenester',
        url: '/arbeidsgiver',
      },
      {
        content: 'Samarbeidspartner',
        description: 'Helsepersonell, tiltaksarrangører, fylker og kommuner',
        url: '/samarbeidspartner',
      },
    ],
  },
};
