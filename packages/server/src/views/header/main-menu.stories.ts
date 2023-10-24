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

export const Default: Story = {
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
