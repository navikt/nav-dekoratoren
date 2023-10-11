import html, { Template } from '../../html';
import { DownChevron } from '../icons/down-chevron';
import cls from './icon-button.module.css';

export function IconButton({
  Icon,
  id,
  text,
  className,
  chevron,
}: {
  Icon: Template;
  id?: string;
  text: string;
  className?: string;
  chevron?: boolean;
}) {
  return html`
    <button id="${id}" class="${cls.iconButton} ${className}">
      ${Icon}
      <span class="${cls.iconButtonSpan}">${text}</span>

      ${chevron && DownChevron({ className: cls.chevron })}
    </button>
  `;
}
