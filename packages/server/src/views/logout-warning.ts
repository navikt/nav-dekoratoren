import html from 'decorator-shared/html';

import utilClasses from 'decorator-client/src/styles/utils.module.css';

export type LogoutWarningProps = unknown;

export function LogoutWarning() {
  return html`<dialog class="modal" id="logout-warning">
    <div class="modal-window">
      <h1 id="logout-warning-title" class="modal-title">
        Du blir snart logget ut automatisk
      </h1>
      <p id="logout-warning-body" class="modal-body">
        Vil du fortsatt være innlogget?
      </p>
      <div class="button-wrapper">
        <button
          class="button button-main ${utilClasses.bigLabel}"
          id="logout-warning-confirm"
        >
          Ja
        </button>
        <button
          class="button button-secondary ${utilClasses.bigLabel}"
          id="logout-warning-cancel"
        >
          Logg ut
        </button>
      </div>
    </div>
  </dialog>`;
}
