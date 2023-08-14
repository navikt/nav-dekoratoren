import { html } from '../../utils';
import { CloseIcon } from '../icons/close';

export default function () {
  return html`
        <template id="toggle-icon-button-template">
        <style>
        .button {
            display: flex;
            gap: 0.5rem/* 8px */;
            color: rgba(0, 103, 197, 1);
            min-width: 95px;
            border-radius: 3px;
            padding-top: 0.75rem/* 12px */;
            padding-bottom: 0.75rem/* 12px */;
            padding-left: 0.5rem/* 8px */;
            padding-right: 0.5rem/* 8px */;
            padding-right: 1rem/* 16px */;
            padding-left: 0.25rem/* 4px */;
            border-width: 2px;
            background-color: rgba(0, 0, 0, 0);
            border-color: rgba(255, 255, 255, 0);
            font-family: 'Source Sans 3';
        }

        .opened, .idle {
            display: flex;
            gap: 6px;
        }


        .opened ::slotted(span), .idle ::slotted(span) {
            font-weight: 600;
            font-size: 16px;
        }

        .opened {
            display: none;
        }

        .button.active .opened {
            display: flex;
         }

        .button.active .idle {
            display: none;
         }

        </style>
        <button
          class="button"
        >
          <div class="idle">
            <slot name="icon"></slot>
            <slot name="idleText"></slot>
          </div>
          <div class="opened">
          ${CloseIcon({
            className: 'group-[.active]:block hidden',
          })}
            <slot name="openedText"></slot>
          <div>
        </button>
        </template>
    `;
}

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
      class="group flex gap-2 text-blue-500 min-w-[95px] rounded-[3px] py-3
      px-2 pr-4 pl-1 border-2 border-transparent hover:border-blue-500
      hover:bg-blue-100 active:bg-surface-action-active active:text-white
      ring-[3px] ring-transparent active:ring-blue-800 active:border
      active:border-white"
      ${onclick ? html`onclick='(${onclick})(this)'` : ''}
    >
      ${Icon({
        className: 'group-[.active]:hidden block',
      })}
      <span class="font-bold group-[.active]:hidden">${idleText}</span>
      ${CloseIcon({
        className: 'group-[.active]:block hidden',
      })}
      <span
        class="font-bold group-[.active]:block
      hidden"
        >${toggledText}</span
      >
    </button>
  `;
}

// Button without a toggle state
export function IconButton({
  Icon,
  id,
  onclick,
  text,
  className,
}: {
  Icon: ({ className }: { className: string }) => string;
  id?: string;
  onclick?: (e: Element) => void;
  text: string;
  className?: string;
}) {
  return html`
    <button
      id="${id}"
      class="group flex gap-2 text-blue-500 min-w-[95px] flex-nowrap
      rounded-[3px] py-3 px-2 pr-4 pl-1 border-2 border-transparent
      hover:border-blue-500 hover:bg-blue-100 active:bg-surface-action-active
      active:text-white ring-[3px] ring-transparent active:ring-blue-800
      active:border active:border-white ${className}"
      ${onclick ? `onclick="(${onclick})(this)"` : ''}
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
