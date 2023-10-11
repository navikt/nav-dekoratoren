import type { StoryObj, Meta } from '@storybook/html';
import type { SearchProps } from './search';
import { SearchIcon } from './search';

const meta: Meta<SearchProps> = {
  title: 'icons/search',
  render: (args) => {
    // @ts-expect-error: document in server-package
    const div = document.createElement('div');
    div.innerHTML = SearchIcon(args).render();

    setInterval(() => {
      div.setAttribute(
        'aria-expanded',
        div.getAttribute('aria-expanded') === 'true' ? 'false' : 'true',
      );
    }, 1000);

    return div;
  },
};

export default meta;
type Story = StoryObj<SearchProps>;

export const Default: Story = {
  args: {
    menuSearch: true,
  },
};
