import { Texts } from 'decorator-shared/types';
import notificationsMock from './notifications-mock.json';
import { NotificationList } from './views/notifications/notifications';
import {
  MessageIcon,
  TaskIcon,
} from 'decorator-shared/views/icons/notifications';

type Oppgave = {
  eventId: string;
  varselId: string;
  tidspunkt: string;
  isMasked: boolean;
  tekst: string | null;
  link: string | null;
  type: string;
  eksternVarslingSendt: boolean;
  eksternVarslingKanaler: string[];
};

type Beskjed = {
  eventId: string;
  varselId: string;
  tidspunkt: string;
  isMasked: boolean;
  tekst: string | null;
  link: string | null;
  type: string;
  eksternVarslingSendt: boolean;
  eksternVarslingKanaler: string[];
};

const getNotifications: (texts: Texts) => Promise<NotificationList[]> = async (
  texts,
) => {
  const kanalToTag = (kanal: string) => {
    switch (kanal) {
      case 'SMS':
        return texts.notified_SMS;
      case 'EPOST':
        return texts.notified_EPOST;
      default:
        return undefined;
    }
  };

  const oppgaveToNotifiction = (oppgave: Oppgave) => ({
    text: oppgave.isMasked ? texts.masked_task_text : oppgave.tekst ?? '',
    date: oppgave.tidspunkt,
    icon: TaskIcon(),
    tags: oppgave.eksternVarslingKanaler
      .map(kanalToTag)
      .filter(Boolean) as string[],
    isArchivable: false,
    link: oppgave.link ?? '',
    id: oppgave.eventId,
    amplitudeKomponent: 'varsel-oppgave',
  });

  const beskjedToNotification = (beskjed: Beskjed) => ({
    text: beskjed.isMasked ? texts.masked_message_text : beskjed.tekst ?? '',
    date: beskjed.tidspunkt,
    icon: MessageIcon(),
    tags: beskjed.eksternVarslingKanaler
      .map(kanalToTag)
      .filter(Boolean) as string[],
    isArchivable: !beskjed.link,
    link: beskjed.link ?? '',
    id: beskjed.eventId,
    amplitudeKomponent: 'varsel-beskjed',
  });

  // await new Promise((r) => setTimeout(r, 3000));

  return Promise.resolve([
    {
      heading: texts.notifications_tasks_title,
      notifications: notificationsMock.oppgaver.map(oppgaveToNotifiction),
    },
    {
      heading: texts.notifications_messages_title,
      notifications: notificationsMock.beskjeder.map(beskjedToNotification),
    },
  ]);
};

export default () => ({
  getNotifications,
});
