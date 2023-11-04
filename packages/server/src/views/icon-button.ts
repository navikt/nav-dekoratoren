import html, { Template } from 'decorator-shared/html';
import { DownChevron } from 'decorator-shared/views/icons/down-chevron';
import cls from 'decorator-client/src/styles/icon-button.module.css';

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
    <button ${id && html`id="${id}"`} class="${cls.iconButton} ${className}">
      ${Icon}
      <span class="${cls.iconButtonSpan}">${text}</span>

      ${chevron && DownChevron({ className: cls.chevron })}
    </button>
  `;
}
