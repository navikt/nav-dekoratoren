import type { StoryObj, Meta } from '@storybook/html';
import type { UserMenuProps } from './user-menu';
import { UserMenu } from './user-menu';
import { texts } from '../../texts';
import {
  MessageIcon,
  TaskIcon,
} from 'decorator-shared/views/icons/notifications';

const meta: Meta<UserMenuProps> = {
  title: 'header/user-menu',
  tags: ['autodocs'],
  render: UserMenu,
};

export default meta;
type Story = StoryObj<UserMenuProps>;

export const LowAuthLevel: Story = {
  args: {
    texts: texts.nb,
    name: 'Charlie Jensen',
    notifications: [
      {
        text: 'Du har fått en oppgave, logg inn med høyere sikkerhetsnivå for å se oppgaven.',
        date: '2023-02-03T14:52:09.623+01:00',
        icon: TaskIcon(),
        title: 'Oppgave',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        text: 'Oppgave 2',
        date: '2023-05-11T10:42:38.247492+02:00',
        icon: TaskIcon(),
        metadata: 'Varslet på SMS',
        title: 'Oppgave',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        id: '1',
        text: 'Beskjed 1',
        date: '2023-07-04T11:41:18.259801+02:00',
        icon: MessageIcon(),
        title: 'Beskjed',
        isArchivable: true,
      },
      {
        text: 'Beskjed 2',
        date: '2023-07-06T13:50:50.825129+02:00',
        icon: MessageIcon(),
        title: 'Beskjed',
        metadata: 'Varslet på e-post',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        text: 'Beskjed 3',
        date: '2023-08-03T14:29:19.052696+02:00',
        icon: MessageIcon(),
        title: 'Beskjed',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
    ],
  },
};

export const HighAuthLevel: Story = {
  args: {
    texts: texts.nb,
    name: 'Charlie Jensen',
    level: 'Level4',
    notifications: [
      {
        text: 'Du har mottatt et vedtak på søknaden din om foreldrepenger.',
        date: '2023-02-03T14:52:09.623+01:00',
        icon: TaskIcon(),
        title: 'Oppgave',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        text: 'Oppgave 2',
        date: '2023-05-11T10:42:38.247492+02:00',
        icon: TaskIcon(),
        metadata: 'Varslet på SMS',
        title: 'Oppgave',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        id: '1',
        text: 'Beskjed 1',
        date: '2023-07-04T11:41:18.259801+02:00',
        icon: MessageIcon(),
        title: 'Beskjed',
        isArchivable: true,
      },
      {
        text: 'Beskjed 2',
        date: '2023-07-06T13:50:50.825129+02:00',
        icon: MessageIcon(),
        title: 'Beskjed',
        metadata: 'Varslet på e-post',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
      {
        text: 'Beskjed 3',
        date: '2023-08-03T14:29:19.052696+02:00',
        icon: MessageIcon(),
        title: 'Beskjed',
        isArchivable: false,
        link: 'http://nav.no',
        amplitudeKomponent: 'wat',
      },
    ],
  },
};
