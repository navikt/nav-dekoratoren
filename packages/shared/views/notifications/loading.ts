import html from '../../html';

export type LoadingNotificationsProps = {
  texts: {
    loading_notifications: string;
  };
};

export function LoadingNotifications({ texts }: LoadingNotificationsProps) {
  return html`<div>
    <decorator-loader title="${texts.loading_notifications}" />
  </div>`;
}
