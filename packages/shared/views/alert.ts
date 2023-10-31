import html from '../html';
import { alertIcons } from './icons/alert';
import cls from 'decorator-client/src/styles/alert.module.css';

//@TODO: Stories?

/**
 * @link https://aksel.nav.no/komponenter/core/alert
 */

type AlertProps = {
  variant: 'error' | 'warning' | 'info' | 'success';
  text: string;
  // @todo: implement if needed
  // size: 'medium' | 'small'
};

export type AlertVariant = AlertProps['variant'];

export const Alert = (props: AlertProps) => {
  const icon = alertIcons[props.variant];

  return html`
    <div class="${cls.alert} ${cls[props.variant]}">
      ${icon}
      <div class="${cls.text}">${props.text}</div>
    </div>
  `;
};
