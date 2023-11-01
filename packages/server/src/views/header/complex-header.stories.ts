import type { StoryObj, Meta } from '@storybook/html';
import type { ComplexHeaderProps } from './complex-header';
import { ComplexHeader } from './complex-header';
import { texts } from '../../texts';
import { makeContextLinks } from 'decorator-shared/context';

const meta: Meta<ComplexHeaderProps> = {
  title: 'header/complex',
  tags: ['autodocs'],
  render: ComplexHeader,
};

export default meta;
type Story = StoryObj<ComplexHeaderProps>;

export const Default: Story = {
  args: {
    context: 'privatperson',
    language: 'nb',
    contextLinks: makeContextLinks(''),
    mainMenuLinks: [
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
    mainMenuContextLinks: [
      { content: 'Min side', url: '/min-side' },
      { content: 'Arbeidsgiver', url: '/arbeidsgiver' },
      { content: 'Samarbeidspartner', url: '/samarbeidspartner' },
    ],
    texts: texts.nb,
  },
};
