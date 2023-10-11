import type { StoryObj, Meta } from '@storybook/html';
import type { SimpleLoggedInMenuProps } from './logged-in-menu';
import { SimpleLoggedInMenu } from './logged-in-menu';

const meta: Meta<SimpleLoggedInMenuProps> = {
  title: 'header/simple-logged-in-menu',
  tags: ['autodocs'],
  render: SimpleLoggedInMenu,
};

export default meta;
type Story = StoryObj<SimpleLoggedInMenuProps>;

export const Default: Story = {
  args: {
    name: 'LOKAL MOCK',
  },
};
