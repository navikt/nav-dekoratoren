import type { StoryObj, Meta } from '@storybook/html';
import type { NotificationsEmptyProps } from './empty';
import { NotificationsEmpty } from './empty';

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
      notifications_empty_list: 'Ingen notifications',
      notifications_empty_list_description: 'Du har ingen notifications',
      notifications_show_all: 'Vis alle notifications',
    },
  },
};
