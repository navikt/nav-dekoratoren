import type { StoryObj, Meta } from '@storybook/html';
import type { NotificationsProps } from './notifications';
import { Notifications } from './notifications';
import {
  MessageIcon,
  TaskIcon,
} from 'decorator-shared/views/icons/notifications';
import { texts } from '../../texts';

const meta: Meta<NotificationsProps> = {
  title: 'notifications/list',
  tags: ['autodocs'],
  render: Notifications,
};

export default meta;
type Story = StoryObj<NotificationsProps>;

export const Default: Story = {
  args: {
    texts: texts.nb,
    notifications: [
      {
        title: 'Oppgave',
        text: 'Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.',
        date: '2023-02-03T14:52:09.623+01:00',
        icon: TaskIcon(),
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        title: 'Oppgave',
        text: 'Oppgave 2',
        date: '2023-05-11T10:42:38.247492+02:00',
        icon: TaskIcon(),
        metadata: 'Varslet på SMS',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        id: '1',
        title: 'Beskjed',
        text: 'Beskjed 1',
        date: '2023-07-04T11:41:18.259801+02:00',
        icon: MessageIcon(),
        isArchivable: true,
      },
      {
        title: 'Beskjed',
        text: 'Beskjed 2',
        date: '2023-07-06T13:50:50.825129+02:00',
        icon: MessageIcon(),
        metadata: 'Varslet på e-post',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        title: 'Beskjed',
        text: 'Beskjed 3',
        date: '2023-08-03T14:29:19.052696+02:00',
        icon: MessageIcon(),
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
    ],
  },
};
