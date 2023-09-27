import type { StoryObj, Meta } from '@storybook/html';
import type { NotificationsEmptyProps } from './notifications';
import { NotificationsEmptyView } from './notifications';

const meta: Meta<NotificationsEmptyProps> = {
  title: 'notifications empty',
  tags: ['autodocs'],
  render: (args) => {
    return NotificationsEmptyView(args);
  },
};

export default meta;
type Story = StoryObj<NotificationsEmptyProps>;
export const Single: Story = {
  args: {
    texts: {
      notifications_empty_list: 'Ingen notifications',
      notifications_empty_list_description: 'Du har ingen notifications',
      notifications_show_all: 'Vis alle notifications',
    },
  },
};
