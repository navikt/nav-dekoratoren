import type { StoryObj, Meta } from '@storybook/html';
import type { SearchFormProps } from './search-form';
import { SearchForm } from './search-form';

const meta: Meta<SearchFormProps> = {
  title: 'search/search-form',
  tags: ['autodocs'],
  render: SearchForm,
};

export default meta;
type Story = StoryObj<SearchFormProps>;

export const Default: Story = {
  args: {
    texts: {
      search_nav_no: 'Search nav.no',
      search: 'Search',
    },
  },
};
