import type { StoryObj, Meta } from '@storybook/html';
import type { ComplexFooterProps } from './complex-footer';
import { ComplexFooter } from './complex-footer';
import html from 'decorator-shared/html';

const meta: Meta<ComplexFooterProps> = {
  title: 'complex-footer',
  tags: ['autodocs'],
  render: (args) => {
    return ComplexFooter(args);
  },
};

export default meta;
type Story = StoryObj<ComplexFooterProps>;

export const Default: Story = {
  args: {
    texts: { to_top: 'Til toppen' },
    links: [
      {
        heading: 'Kontakt',
        children: [
          {
            content: 'Kontakt oss',
            url: '/person/kontakt-oss/nb',
          },
          {
            content: 'NAV i ditt fylke',
            url: '/no/nav-og-samfunn/kontakt-nav/nav-i-ditt-fylke',
          },
          {
            content: 'Kurs fra NAV',
            url: '/no/nav-og-samfunn/kontakt-nav/kurs-fra-nav',
          },
          {
            content: 'Klage, tilbakemelding, ros',
            url: '/person/kontakt-oss/tilbakemeldinger',
          },
        ],
      },
      {
        heading: 'Nyheter og presse',
        children: [
          {
            content: 'Nyheter, pressemeldinger og pressekontakt',
            url: '/samarbeidspartner/presse',
          },
        ],
      },
      {
        heading: 'NAV og samfunn',
        children: [
          {
            content: 'Statistikk, analyse og FoU',
            url: '/no/nav-og-samfunn/statistikk-analyse-og-fou',
          },
          {
            content: 'Lover og regler (lovdata.no)',
            url: 'https://lovdata.no/nav/',
          },
          {
            content: 'Om NAV',
            url: '/no/nav-og-samfunn/om-nav/om-nav',
          },
        ],
      },
      {
        heading: 'Andre språk',
        children: [
          {
            content: 'English',
            url: '/en',
          },
          {
            content: 'Sámegiella',
            url: '/se',
          },
        ],
      },
      {
        children: [
          {
            content: 'Personvern og informasjonskapsler',
            url: '/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten',
          },
          {
            content: 'Tilgjengelighet',
            url: '/tilgjengelighet',
          },
          {
            content: html`Del skjerm<svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                role="img"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.25 4.5c0-.69.56-1.25 1.25-1.25h17c.69 0 1.25.56 1.25 1.25v11c0 .69-.56 1.25-1.25 1.25h-7.75v2.5H19a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1 0-1.5h5.25v-2.5H3.5c-.69 0-1.25-.56-1.25-1.25v-11Zm1.5.25v10.5h16.5V4.75H3.75Z"
                  fill="currentColor"
                ></path>
              </svg>`,
            url: '#',
          },
        ],
      },
    ],
  },
};
