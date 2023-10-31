import html from '../html';

import cls from 'decorator-client/src/styles/screensharing.module.css';
import clsModal from 'decorator-client/src/styles/modal.module.css';
import clsInputs from 'decorator-client/src/styles/inputs.module.css';

import { Button } from './components/button';
import { Texts } from '../types';
import { ReadMore } from './read-more';

export type ScreensharingModalProps = {
  texts: Pick<
    Texts,
    | 'footer_del_skerm'
    | 'delskjerm_modal_beskrivelse'
    | 'delskjerm_modal_start'
    | 'delskjerm_modal_label'
    | 'delskjerm_modal_avbryt'
    | 'delskjerm_modal_feilmelding'
  >;
};

// @TODO: Should make inputs into a component?

export const ScreensharingModal = ({ texts }: ScreensharingModalProps) =>
  html`<dialog
    is="screensharing-modal"
    class="${clsModal.modal} ${cls.screensharingModal}"
  >
    <img src="/public/ikoner/del-skjerm/Veileder.svg" class="${cls.avatar}" />
    <div class="${clsModal.modalWindow} ${cls.content}">
      <h1 class="${clsModal.modalTitle}">${texts.footer_del_skerm}</h1>
      <p>${texts.delskjerm_modal_beskrivelse}</p>
      <p>
        ${ReadMore({
          question: 'Hva er del skjerm?',
          answer: `Når du deler skjerm med NAV kontaktsenter kan veilederen hjelpe deg med å finne fram på nav.no. Veilederen ser kun det du ser på nav.no og kan ikke fylle inn opplysninger eller sende inn noe på dine vegne. Det er du som godkjenner skjermdeling. Ingenting blir lagret.`,
        })}
      </p>
      <div>
        <label for="screensharing_code" class="${clsInputs.textInputLabel}">${
          texts.delskjerm_modal_label
        }</label>
        <input
          id="screensharing_code"
          class="${clsInputs.textInput}"
          type="text"
          maxlength="5"
        />
        <ul class="${clsInputs.errorList}">
            <li>${texts.delskjerm_modal_feilmelding}</li>
        <ul>
      </div>
      <div class="${cls.buttonsWrapper}">
        ${Button({
          text: texts.delskjerm_modal_start,
          variant: 'primary',
          bigLabel: true,
          id: 'screensharing-confirm',
        })}
        ${Button({
          text: texts.delskjerm_modal_avbryt,
          variant: 'ghost',
          bigLabel: true,
          id: 'screensharing-cancel',
        })}
      </div>
    </div>
  </dialog>`;
