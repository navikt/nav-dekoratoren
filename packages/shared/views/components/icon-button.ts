import html, { Template } from '../../html';

export function IconButton({
  Icon,
  id,
  onclick,
  text,
  className,
}: {
  Icon: ({ className }: { className: string }) => Template;
  id?: string;
  onclick?: (e: Element) => void;
  text: string;
  className?: string;
}) {
  return html`
    <button
      id="${id}"
      class="icon-button ${className}"
      ${onclick ? `onclick="(${onclick})(this)"` : ''}
    >
      ${Icon({
        className: '',
      })}
      <span class="icon-button-span">${text}</span>
    </button>
  `;
}
