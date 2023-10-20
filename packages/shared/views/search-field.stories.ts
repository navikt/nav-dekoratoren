import type { StoryObj, Meta } from '@storybook/html';
import type { SearchFieldProps } from './search-field';
import { SearchField } from './search-field';

const meta: Meta<SearchFieldProps> = {
  title: 'search/search-field',
  tags: ['autodocs'],
  render: SearchField,
};

export default meta;
type Story = StoryObj<SearchFieldProps>;

export const Default: Story = {
  args: {
    texts: {
      search_nav_no: 'Search nav.no',
      search: 'Search',
    },
  },
};
