import type { StoryObj, Meta } from '@storybook/html';
import type { NotificationsEmptyProps } from './notifications-empty';
import { NotificationsEmpty } from './notifications-empty';

const meta: Meta<NotificationsEmptyProps> = {
  title: 'notifications/empty',
  tags: ['autodocs'],
  render: (args) => {
    return NotificationsEmpty(args);
  },
};

export default meta;
type Story = StoryObj<NotificationsEmptyProps>;

export const Default: Story = {
  args: {
    texts: {
      notifications_empty_list: 'Du har ingen nye varsler',
      notifications_empty_list_description: 'Vi varsler deg når noe skjer.',
      notifications_show_all: 'Se tidligere varsler',
    },
  },
};
