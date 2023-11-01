import clsx from 'clsx';
import html, { Template } from '../html';
import { alertIcons } from './icons/alert';
import cls from 'decorator-client/src/styles/alert.module.css';

//@TODO: Stories?

/**
 * @link https://aksel.nav.no/komponenter/core/alert
 */

type AlertProps = {
  variant: 'error' | 'warning' | 'info' | 'success';
  content: Template | string;
  className?: string;
  // @todo: implement if needed
  // size: 'medium' | 'small'
};

export type AlertVariant = AlertProps['variant'];

export const Alert = (props: AlertProps) => {
  const icon = alertIcons[props.variant];

  return html`
    <div class="${clsx(cls.alert, cls[props.variant], props.className)}">
      ${icon}
      <div class="${cls.text}">${props.content}</div>
    </div>
  `;
};
