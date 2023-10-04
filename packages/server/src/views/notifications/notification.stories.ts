import type { StoryObj, Meta } from '@storybook/html';
import type { NotificationProps } from './notification';
import { Notification } from './notification';
import { TaskIcon } from 'decorator-shared/views/icons/notifications';

const meta: Meta<NotificationProps> = {
  title: 'notifications/notification',
  tags: ['autodocs'],
  render: Notification,
};

export default meta;
type Story = StoryObj<NotificationProps>;

export const Default: Story = {
  args: {
    text: 'Beskjed uten lenke',
    link: 'https://www.nav.no',
    date: '2023-08-08T13:24:23.75234+02:00',
    icon: TaskIcon(),
    tags: ['Varslet på e-post'],
  },
};
