import cls from 'decorator-client/src/styles/notifications.module.css';
import html from 'decorator-shared/html';
import {
  MessageIcon,
  TaskIcon,
} from 'decorator-shared/views/icons/notifications';
import { ArchivableNotification } from './archivable-notification';
import { Notification } from './notification';

type NotificationChannel = 'SMS' | 'EPOST';

export type Notification = {
  tidspunkt: string;
  eventId: string;
  eksternVarslingKanaler: NotificationChannel[];
} & (
  | {
      type: 'oppgave';
      link: string;
    }
  | {
      type: 'beskjed';
      link?: string;
    }
) &
  (
    | {
        isMasked: true;
      }
    | {
        isMasked: false;
        tekst: string;
      }
  );

type NotificationsData = {
  oppgaver: Notification[];
  beskjeder: Notification[];
};

export type NotificationsPopulatedProps = {
  texts: {
    notifications_tasks_title: string;
    notifications_messages_title: string;
    masked_message_text: string;
    masked_task_text: string;
    archive: string;
    notified_EPOST: string;
    notified_SMS: string;
    earlier_notifications: string;
  };
  notificationsData: NotificationsData;
};

export function NotificationsPopulated({
  texts,
  notificationsData,
}: NotificationsPopulatedProps) {
  const { beskjeder, oppgaver } = notificationsData;

  return html`
    <div class="${cls.notificationsPopulated}">
      <div>
        <h2 class="${cls.sectionHeading}">
          ${texts.notifications_tasks_title}
        </h2>
        <ul class="${cls.notificationList}">
          ${oppgaver
            .sort((a, b) =>
              new Date(a.tidspunkt) > new Date(b.tidspunkt) ? -1 : 1,
            )
            .map(
              (task) =>
                html`<li>
                  ${Notification2({
                    title: task.isMasked ? texts.masked_task_text : task.tekst,
                    icon: TaskIcon(),
                    notification: task,
                    texts,
                  })}
                </li>`,
            )}
        </ul>
      </div>
      <div>
        <h2 class="${cls.sectionHeading}">
          ${texts.notifications_messages_title}
        </h2>
        <ul class="${cls.notificationList}">
          ${beskjeder
            .sort((a, b) =>
              new Date(a.tidspunkt) > new Date(b.tidspunkt) ? -1 : 1,
            )
            .map(
              (message) =>
                html`<li>
                  ${Notification2({
                    title: message.isMasked
                      ? texts.masked_message_text
                      : message.tekst,
                    icon: MessageIcon(),
                    notification: message,
                    texts,
                  })}
                </li>`,
            )}
        </ul>
      </div>
      <div>
        <a
          class="${cls.tidligereNotifications}"
          href="${process.env.VITE_MIN_SIDE_URL}/all-notifications"
        >
          ${texts.earlier_notifications}
        </a>
      </div>
    </div>
  `;
}

function Notification2({
  title,
  icon,
  notification: notification,
  texts,
}: {
  title: string;
  icon: string;
  notification: Notification;
  texts: {
    archive: string;
    notified_EPOST: string;
    notified_SMS: string;
  };
}) {
  if (notification.type !== 'oppgave' && !notification.link) {
    return ArchivableNotification({
      text: title,
      date: notification.tidspunkt,
      icon,
      tags: notification.eksternVarslingKanaler.map(
        (channel) => texts[`notified_${channel}`],
      ),
      texts,
    });
  } else {
    return Notification({
      text: title,
      link: notification.link as string,
      date: notification.tidspunkt,
      icon,
      tags: notification.eksternVarslingKanaler.map(
        (channel) => texts[`notified_${channel}`],
      ),
    });
  }
}
