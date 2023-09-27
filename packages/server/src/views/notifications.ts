import cls from 'decorator-client/src/styles/notifications.module.css';
import html from 'decorator-shared/html';
import { ForwardChevron } from 'decorator-shared/views/icons/forward-chevron';
import { LinkButton } from 'decorator-shared/views/components/link-button';
import {
  MessageIcon,
  TaskIcon,
} from 'decorator-shared/views/icons/notifications';

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
          ${oppgaver.map(
            (task) =>
              html`<li>
                ${Notification({
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
          ${beskjeder.map(
            (message) =>
              html`<li>
                ${Notification({
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

function formatNotificationDate(tidspunkt: string): string {
  const date = new Date(tidspunkt);
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  } as const;
  return date.toLocaleDateString('nb-NO', options).replace(':', '.');
}

function Notification({
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
    return html`
      <archivable-notification
        class="${[cls.notification, cls.isArchivable].join(' ')}"
        data-event-id="${notification.eventId}"
      >
        <div>
          <div class="${cls.title}">${title}</div>
          <div class="${cls.time}">
            ${formatNotificationDate(notification.tidspunkt)}
          </div>
        </div>
        <div class="${cls.bottom}">
          <div class="${cls.meta}">
            ${icon}
            ${notification.eksternVarslingKanaler.map(
              (kanal) =>
                html`<span class="${cls.notificationNotice}"
                  >${texts[`notified_${kanal}`]}</span
                >`,
            )}
          </div>
          ${LinkButton({
            className: 'archive-notification',
            text: texts.archive,
          })}
        </div>
      </archivable-notification>
    `;
  } else {
    return html`
      <div class="${cls.notification}">
        <div>
          <a href="${notification.link}" class="${cls.title}">${title}</a>
          <div class="${cls.time}">
            ${formatNotificationDate(notification.tidspunkt)}
          </div>
        </div>
        <div class="${cls.bottom}">
          <div class="${cls.meta}">
            ${icon}
            ${notification.eksternVarslingKanaler.map(
              (channel) =>
                html`<span class="${cls.notificationNotice}"
                  >${texts[`notified_${channel}`]}</span
                >`,
            )}
          </div>
          ${ForwardChevron({ className: cls.forwardChevron })}
        </div>
      </div>
    `;
  }
}
