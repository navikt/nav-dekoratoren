import type { StoryObj, Meta } from '@storybook/html';
import type { BreadcrumbsProps } from './breadcrumbs';
import { Breadcrumbs } from './breadcrumbs';

const meta: Meta<BreadcrumbsProps> = {
  title: 'header/breadcrumbs',
  tags: ['autodocs'],
  render: Breadcrumbs,
};

export default meta;
type Story = StoryObj<BreadcrumbsProps>;

export const Default: Story = {
  args: {
    breadcrumbs: [
      {
        title: 'Arbeid og opphold i Norge',
        url: '/no/person/flere-tema/arbeid-og-opphold-i-norge',
      },
      {
        title: 'Medlemskap i folketrygden',
      },
    ],
  },
};

export const Empty: Story = {
  args: {
    breadcrumbs: [],
  },
};
