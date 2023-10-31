import html from '../../html';
import { ErrorIcon } from '../icons';
import cls from './error.module.css';

export type ErrorProps = {
  text: string;
};

export function Error({ text }: ErrorProps) {
  return html`<div class="${cls.error}">
    ${ErrorIcon({ className: cls.errorIcon })}
    <div>${text}</div>
  </div>`;
}
