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

const role = {
  info: undefined,
  success: 'status',
  warning: 'status',
  error: 'alert',
};

export const Alert = (props: AlertProps) => {
  const { variant, content, className } = props;
  return html`
    <div
      role="${role[variant]}"
      class="${clsx(cls.alert, cls[variant], className)}"
    >
      ${alertIcons[variant]}
      <span class="${cls.text}">${content}</span>
    </div>
  `;
};
