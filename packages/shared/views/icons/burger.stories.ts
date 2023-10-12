import type { StoryObj, Meta } from '@storybook/html';
import { BurgerIcon } from './burger';

const meta: Meta = {
  title: 'icons/burger',
  render: () => {
    // @ts-expect-error: document in server-package
    const div = document.createElement('div');
    div.innerHTML = BurgerIcon().render();

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
type Story = StoryObj;

export const Default: Story = {};
