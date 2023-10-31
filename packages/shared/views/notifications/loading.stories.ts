import type { StoryObj, Meta } from '@storybook/html';
import type { LoadingNotificationsProps } from './loading';
import { LoadingNotifications } from './loading';

const meta: Meta<LoadingNotificationsProps> = {
  title: 'notifications/loading',
  tags: ['autodocs'],
  render: (args) => {
    return LoadingNotifications(args);
  },
};

export default meta;
type Story = StoryObj<LoadingNotificationsProps>;

export const Default: Story = {
  args: {
    texts: {
      loading_notifications: 'Laster innhold...',
    },
  },
};
