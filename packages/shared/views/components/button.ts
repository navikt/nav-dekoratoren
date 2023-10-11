import clsx from 'clsx';
import html from '../../html';
import cls from './button.module.css';

export type ButtonProps = {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
  bigLabel?: boolean;
  wide?: boolean;
  className?: string;
};

export const Button = ({
  text,
  variant,
  bigLabel,
  wide,
  className,
}: ButtonProps) => html`
  <button
    class="${clsx(
      cls.button,
      {
        [cls.primary]: variant === 'primary',
        [cls.secondary]: variant === 'secondary',
        [cls.outline]: variant === 'outline',
        [cls.bigLabel]: bigLabel,
        [cls.wide]: wide,
      },
      className,
    )}"
  >
    ${text}
  </button>
`;
