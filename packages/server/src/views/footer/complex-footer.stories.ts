import type { StoryObj, Meta } from '@storybook/html';
import type { ComplexFooterProps } from './complex-footer';
import { ComplexFooter } from './complex-footer';
import { texts } from '../../texts';

const meta: Meta<ComplexFooterProps> = {
    title: 'footer/complex',
    tags: ['autodocs'],
    render: ComplexFooter,
};

export default meta;
type Story = StoryObj<ComplexFooterProps>;

export const Default: Story = {
    args: {
        features: {
            'dekoratoren.skjermdeling': true,
            'dekoratoren.chatbotscript': false,
        },
        texts: texts.nb,
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
                ],
            },
        ],
    },
};
