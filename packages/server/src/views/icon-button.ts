import html, { Template } from 'decorator-shared/html';
import cls from '@styles/icon-button.module.json';

export function IconButton({
  Icon,
  id,
  text,
  className,
}: {
  Icon: Template;
  id?: string;
  text: Template | string;
  className?: string;
}) {
  return html`
    <button ${id && html`id="${id}"`} class="${cls.iconButton} ${className}">
      ${Icon}
      <span class="${cls.iconButtonSpan}">${text}</span>
    </button>
  `;
}
