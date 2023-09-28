import type { StoryObj, Meta } from '@storybook/html';
import type { ArchivableNotificationProps } from './archivable-notification';
import { ArchivableNotification } from './archivable-notification';
import { MessageIcon } from 'decorator-shared/views/icons/notifications';

const meta: Meta<ArchivableNotificationProps> = {
  title: 'notifications/archivable-notification',
  tags: ['autodocs'],
  render: ArchivableNotification,
};

export default meta;
type Story = StoryObj<ArchivableNotificationProps>;

export const Default: Story = {
  args: {
    text: 'Beskjed uten lenke',
    date: '13. september 2023 12.55',
    icon: MessageIcon(),
    tags: ['Varslet på e-post'],
    texts: {
      archive: 'Arkiver',
    },
  },
};
