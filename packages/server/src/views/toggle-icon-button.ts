import { html } from 'decorator-shared/utils';
import { CloseIcon } from 'decorator-shared/views/icons/close';

export default function () {
  return html`
        <template id="toggle-icon-button-template">
        <style>
        .button {
            cursor: pointer;
            display: flex;
            gap: 0.5rem/* 8px */;
            color: rgba(0, 103, 197, 1);
            min-width: 95px;
            border-radius: 3px;
            padding-top: 0.75rem/* 12px */;
            padding-bottom: 0.75rem/* 12px */;
            padding-right: 1rem/* 16px */;
            padding-left: 0.25rem/* 4px */;
            border-width: 2px;
            background-color: rgba(0, 0, 0, 0);
            border-color: rgba(255, 255, 255, 0);
            font-family: 'Source Sans 3';
            border: 2px solid transparent;
            outline: 2px solid transparent;
        }

        .opened, .idle {
            display: flex;
            gap: 6px;
        }

        /* Should find a better soluion for this */
        @media (max-width: 1024px) {
            .opened, .idle {
                flex-direction: column;
                align-items: center;
                gap: 0px;
            }

            .button {
                min-width: 0px;
                justify-content: center;
                align-items: center;
            }
        }

        .opened ::slotted(span), .idle ::slotted(span) {
            font-weight: 600;
            font-size: 18px;
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

         .button:hover {
             border-color: rgba(0, 103, 197, 1);
             background-color: var(--a-blue-100);
         }

        .button:active {
            color: white;
            background-color: var(--a-surface-action-active);
            border: 1px solid white;
            margin: 1px;
            outline: 3px solid var(--a-blue-800);
        }

        .button:active .close-icon {
            /* display: block; */
        }


        </style>
        <button
          class="button toggle-icon-button"
        >
          <div class="idle">
            <slot name="icon"></slot>
            <slot name="idleText"></slot>
          </div>
          <div class="opened">
          ${CloseIcon({})}
            <slot name="openedText"></slot>
          <div>
        </button>
        </template>
    `;
}
