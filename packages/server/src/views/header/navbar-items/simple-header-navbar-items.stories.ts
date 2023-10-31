import type { StoryObj, Meta } from '@storybook/html';
import type { SimpleHeaderNavbarItemsProps } from './simple-header-navbar-items';
import { SimpleHeaderNavbarItems } from './simple-header-navbar-items';

const meta: Meta<SimpleHeaderNavbarItemsProps> = {
  title: 'header/simple-navbar-items',
  tags: ['autodocs'],
  render: SimpleHeaderNavbarItems,
};

export default meta;
type Story = StoryObj<SimpleHeaderNavbarItemsProps>;

export const LoggedIn: Story = {
  args: {
    innlogget: true,
    name: 'Ola Nordmann',
    texts: {
      login: 'Log in',
      logged_in: 'Logged in',
      logout: 'Log out',
    },
  },
};

export const LoggedOut: Story = {
  args: {
    innlogget: false,
    texts: {
      login: 'Log in',
      logged_in: 'Logged in',
      logout: 'Log out',
    },
  },
};
