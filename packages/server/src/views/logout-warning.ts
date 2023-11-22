import html from 'decorator-shared/html';
import cls from '@styles/logout-warning.module.json';
import clsModal from '@styles/modal.module.json';
import { Button } from 'decorator-shared/views/components/button';

export type LogoutWarningProps = unknown;

export function LogoutWarning() {
  return html`<dialog class="${clsModal.modal}" id="logout-warning">
    <div class="${clsModal.modalWindow}">
      <h1 id="logout-warning-title" class="${clsModal.modalTitle}">
        Du blir snart logget ut automatisk
      </h1>
      <p id="logout-warning-body" class="${clsModal.modalBody}">
        Vil du fortsatt ${'være'} innlogget?
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
