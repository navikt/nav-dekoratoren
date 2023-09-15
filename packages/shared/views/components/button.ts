import html from '../../html';

export function Button({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return html`
    <button
      class="${'py-3 px-5 border-small min-w-[109px] font-semibold text-text-action border-2 border-text-action hover:bg-surface-action-subtle-hover ' +
      className}"
    >
      ${text}
    </button>
  `;
}
