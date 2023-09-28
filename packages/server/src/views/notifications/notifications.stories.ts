import type { StoryObj, Meta } from '@storybook/html';
import type { NotificationsProps } from './notifications';
import { Notifications } from './notifications';
import {
  MessageIcon,
  TaskIcon,
} from 'decorator-shared/views/icons/notifications';

const meta: Meta<NotificationsProps> = {
  title: 'notifications/list',
  tags: ['autodocs'],
  render: Notifications,
};

export default meta;
type Story = StoryObj<NotificationsProps>;

export const Default: Story = {
  args: {
    texts: {
      archive: 'Arkiver',
      earlier_notifications: 'Tidligere varslinger',
    },
    notificationLists: [
      {
        heading: 'Oppgaver',
        notifications: [
          {
            text: 'Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.',
            date: '2023-02-03T14:52:09.623+01:00',
            icon: TaskIcon(),
            tags: [],
            isArchivable: false,
            link: 'http://nav.no',
          },
          {
            text: 'Oppgave 2',
            date: '2023-05-11T10:42:38.247492+02:00',
            icon: TaskIcon(),
            tags: ['Varslet på SMS'],
            isArchivable: false,
            link: 'http://nav.no',
          },
        ],
      },
      {
        heading: 'Beskjeder',
        notifications: [
          {
            text: 'Beskjed 1',
            date: '2023-07-04T11:41:18.259801+02:00',
            icon: MessageIcon(),
            tags: [],
            isArchivable: true,
          },
          {
            text: 'Beskjed 2',
            date: '2023-07-06T13:50:50.825129+02:00',
            icon: MessageIcon(),
            tags: ['Varslet på e-post'],
            isArchivable: false,
            link: 'http://nav.no',
          },
          {
            text: 'Beskjed 3',
            date: '2023-08-03T14:29:19.052696+02:00',
            icon: MessageIcon(),
            tags: [],
            isArchivable: false,
            link: 'http://nav.no',
          },
        ],
      },
    ],
  },
};
