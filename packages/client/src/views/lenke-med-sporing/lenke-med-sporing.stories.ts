import type { StoryObj, Meta } from '@storybook/html';
import {
  LenkeMedSporing,
  LenkeMedSporingProps,
} from 'decorator-shared/views/lenke-med-sporing-helpers';
import './lenke-med-sporing';
import html from 'decorator-shared/html';

const meta: Meta<LenkeMedSporingProps> = {
  title: 'lenke-med-sporing',
  tags: ['autodocs'],
  render: LenkeMedSporing,
};

type Story = StoryObj<LenkeMedSporingProps>;

export const Standard: Story = {
  args: {
    href: 'https://www.nav.no',
    children: html`<span>Lenke med sporingsdata</span>`,
    analyticsEventArgs: {
      context: 'privatperson',
      category: 'dekorator-header',
      action: 'lenke',
    },
  },
};

export default meta;
