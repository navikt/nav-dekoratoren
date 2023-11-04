import type { StoryObj, Meta } from '@storybook/html';
import type { NotificationsEmptyProps } from './notifications-empty';
import { NotificationsEmpty } from './notifications-empty';
import { texts } from '../../texts';

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
    texts: texts.nb,
  },
};
