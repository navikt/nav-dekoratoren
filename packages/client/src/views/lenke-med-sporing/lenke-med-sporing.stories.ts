import type { StoryObj, Meta } from '@storybook/html';
import {
  LenkeMedSporing,
  LenkeMedSporingProps,
  VariantKey,
} from 'decorator-shared/views/lenke-med-sporing/lenke-med-sporing-helpers';
import './lenke-med-sporing';
import html from 'decorator-shared/html';

type Args = {
  data: LenkeMedSporingProps;
  variant: VariantKey;
};

const meta: Meta<Args> = {
  title: 'lenke-med-sporing',
  tags: ['autodocs'],
  render: (args) => {
    return LenkeMedSporing(args.data, args.variant);
  },
  argTypes: {
    variant: {
      options: ['standard', 'chevron'],
      control: {
        type: 'select',
      },
    },
  },
};

type Story = StoryObj<Args>;

const shared = {
  href: 'https://www.nav.no',
  children: html`<span>Lenke med sporingsdata</span>`,
  analyticsEventArgs: {
    context: 'privatperson',
    category: 'dekorator-header',
    action: 'lenke',
  },
} as const;

export const Standard: Story = {
  args: {
    data: shared,
    variant: 'standard',
  },
};

export const Chevron: Story = {
  args: {
    data: shared,
    variant: 'chevron',
  },
};

export default meta;
