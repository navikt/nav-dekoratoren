import html from 'decorator-shared/html';
import cls from './logout-warning.module.css';
import utilClasses from 'decorator-client/src/styles/utils.module.css';

export type LogoutWarningProps = unknown;

export function LogoutWarning() {
  return html`<dialog class="${cls.modal}" id="logout-warning">
    <div class="${cls.modalWindow}">
      <h1 id="logout-warning-title" class="${cls.modalTitle}">
        Du blir snart logget ut automatisk
      </h1>
      <p id="logout-warning-body" class="${cls.modalBody}">
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
