import { Texts } from 'decorator-shared/types';
import notificationsMock from './notifications-mock.json';
import { Notification } from './views/notifications/notifications';
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

const getNotifications: (
  texts: Texts,
) => Promise<Notification[] | undefined> = async (texts) => {
  const kanalerToMetadata = (kanaler: string[]) => {
    if (kanaler.includes('SMS') && kanaler.includes('EPOST')) {
      return texts.notified_SMS_and_EPOST;
    } else if (kanaler.includes('SMS')) {
      return texts.notified_SMS;
    } else if (kanaler.includes('EPOST')) {
      return texts.notified_EPOST;
    } else {
      return undefined;
    }
  };

  const oppgaveToNotifiction = (oppgave: Oppgave) => ({
    title: texts.task,
    text: oppgave.isMasked ? texts.masked_task_text : oppgave.tekst ?? '',
    date: oppgave.tidspunkt,
    icon: TaskIcon(),
    metadata: kanalerToMetadata(oppgave.eksternVarslingKanaler),
    isArchivable: false,
    link: oppgave.link ?? '',
    id: oppgave.eventId,
    amplitudeKomponent: 'varsel-oppgave',
  });

  const beskjedToNotification = (beskjed: Beskjed) => ({
    title: texts.message,
    text: beskjed.isMasked ? texts.masked_message_text : beskjed.tekst ?? '',
    date: beskjed.tidspunkt,
    icon: MessageIcon(),
    metadata: kanalerToMetadata(beskjed.eksternVarslingKanaler),
    isArchivable: !beskjed.link,
    link: beskjed.link ?? '',
    id: beskjed.eventId,
    amplitudeKomponent: 'varsel-beskjed',
  });

  return Promise.resolve([
    ...notificationsMock.oppgaver.map(oppgaveToNotifiction),
    ...notificationsMock.beskjeder.map(beskjedToNotification),
  ]);
};

export default () => ({
  getNotifications,
});
