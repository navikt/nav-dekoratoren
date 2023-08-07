import { html } from '../../utils';
import { CloseIcon } from '../icons/close';

export function ToggleIconButton({
  idleText,
  toggledText,
  onclick,
  Icon,
  id,
}: {
  idleText: string;
  toggledText: string;
  Icon: ({ className }: { className: string }) => string;
  id?: string;
  onclick?: (e: Element) => void;
}) {
  return html`
    <button
      id="${id}"
      class="group flex gap-2 text-blue-500 min-w-[95px] rounded-[3px] py-3 px-2 pr-4 pl-1 border-2 border-transparent hover:border-blue-500 hover:bg-blue-100 active:bg-surface-action-active active:text-white ring-[3px] ring-transparent active:ring-blue-800 active:border active:border-white"
      onclick="(${onclick})(this)"
    >
      ${Icon({
        className: 'group-[.active]:hidden block',
      })}
      <span class="font-bold group-[.active]:hidden">${idleText}</span>
      ${CloseIcon({
        className: 'group-[.active]:block hidden',
      })}
      <span class="font-bold group-[.active]:block hidden">${toggledText}</span>
    </button>
  `;
}

// Button without a toggle state
export function IconButton({
  Icon,
  id,
  // onclick,
  text,
}: {
  Icon: ({ className }: { className: string }) => string;
  id?: string;
  onclick?: (e: Element) => void;
  text: string;
}) {
  return html`
    <button
      id="${id}"
      class="group flex gap-2 text-blue-500 min-w-[95px] flex-nowrap rounded-[3px] py-3 px-2 pr-4 pl-1 border-2 border-transparent hover:border-blue-500 hover:bg-blue-100 active:bg-surface-action-active active:text-white ring-[3px] ring-transparent active:ring-blue-800 active:border active:border-white"
    >
      ${Icon({
        className: 'group-[.active]:hidden block',
      })}
      <span class="font-bold whitespace-nowrap group-[.active]:hidden"
        >${text}</span
      >
    </button>
  `;
}
