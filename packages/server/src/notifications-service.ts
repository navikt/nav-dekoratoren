import { Texts } from 'decorator-shared/types';
import notificationsMock from './notifications-mock.json';
import { Notification } from './views/notifications/notifications';
import {
  MessageIcon,
  TaskIcon,
} from 'decorator-shared/views/icons/notifications';
import { Language } from 'decorator-shared/params';
import { env } from './env/server';
import { match } from 'ts-pattern';

export type NotificationsService = {
    getNotifications: ({
        texts,
        request,
    }: {
        texts: Texts;
        request: Request;
    }) => Promise<Notification[] | undefined>;
}

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

type NotificationData = {
    oppgaver: Oppgave[];
    beskjeder: Beskjed[];
}

const getNotifications: (
  texts: Texts,
  data: NotificationData
) => Promise<Notification[] | undefined> = async (texts, data) => {
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
    ...data.oppgaver.map(oppgaveToNotifiction),
    ...data.beskjeder.map(beskjedToNotification),
  ]);
};


export const getNotificationsDev = () => {
    return {
        getNotifications: async ({
            texts
        }: {
            texts: Texts;
        }) => {
            // just for dev
            return getNotifications(texts, notificationsMock);
        }
    }
};

export const hentVarslerFetch = (
    VARSEL_API_URL: string,
    // Test without
    request: Request,
): Promise<NotificationData> => {

    return fetch(`${VARSEL_API_URL}/varselbjelle/varsler`, {
        headers: {
            ...request.headers.entries(),
        },
        credentials: 'include',
        verbose: true,
    })
    .then((response) => response.json() as Promise<NotificationData>)
}



export const getNotificationsProd = () => {
    return {
        getNotifications: async ({
            request,
            texts
        }: {
            request: Request;
            texts: Texts;
        }) => {
            const notificationData = await hentVarslerFetch(env.VARSEL_API_URL, request);
            return getNotifications(texts, notificationData);
        }
    }
}

export default () => {
    return match(env.NODE_ENV)
        .with('development', () => getNotificationsDev())
        .with('production', () => getNotificationsProd())
        .exhaustive()
}
