import html, { Template } from 'decorator-shared/html';
import { ErrorIcon, InfoSquareIcon } from 'decorator-shared/views/icons';
import cls from 'decorator-client/src/styles/alert.module.css';
import clsx from 'clsx';

export type AlertProps = {
  content: Template | string;
  variant: 'error' | 'info';
  className?: string;
};

export const Alert = ({ content: text, variant, className }: AlertProps) =>
  html`<div class="${clsx(cls.alert, cls[variant], className)}">
    ${variant === 'error'
      ? ErrorIcon({ className: cls.icon })
      : InfoSquareIcon({ className: cls.icon })}
    <div>${text}</div>
  </div>`;
