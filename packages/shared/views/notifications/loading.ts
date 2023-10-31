import html from '../../html';
import cls from './loading.module.css';

export type LoadingNotificationsProps = {
  texts: {
    loading_notifications: string;
  };
};

export function LoadingNotifications({ texts }: LoadingNotificationsProps) {
  return html`<div class="${cls.loadingNotifications}">
    <decorator-loader title=""></decorator-loader>
    <div>${texts.loading_notifications}</div>
  </div>`;
}
