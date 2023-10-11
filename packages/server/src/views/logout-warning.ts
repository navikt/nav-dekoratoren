import html from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/logout-warning.module.css';
import { Button } from 'decorator-shared/views/components/button';

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
      <div class="${cls.buttonWrapper}">
        ${Button({
          text: 'Ja',
          variant: 'primary',
          bigLabel: true,
          id: 'logout-warning-confirm',
        })}
        ${Button({
          text: 'Logg ut',
          variant: 'secondary',
          bigLabel: true,
          id: 'logout-warning-cancel',
        })}
      </div>
    </div>
  </dialog>`;
}
