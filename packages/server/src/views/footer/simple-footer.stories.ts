import type { StoryObj, Meta } from '@storybook/html';
import type { SimpleFooterProps } from './simple-footer';
import { SimpleFooter } from './simple-footer';

const meta: Meta<SimpleFooterProps> = {
  title: 'simple-footer',
  tags: ['autodocs'],
  render: SimpleFooter,
};

export default meta;
type Story = StoryObj<SimpleFooterProps>;

export const Default: Story = {
  args: {
    features: {
      'dekoratoren.skjermdeling': true,
      'dekoratoren.chatbotscript': false,
    },
    texts: {
      share_screen: 'Del skjerm med veileder',
    },
    links: [
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
};
