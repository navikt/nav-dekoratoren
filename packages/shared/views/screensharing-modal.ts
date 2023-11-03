import html from '../html';

import cls from 'decorator-client/src/styles/screensharing.module.css';
import clsModal from 'decorator-client/src/styles/modal.module.css';
import clsInputs from 'decorator-client/src/styles/inputs.module.css';

import { Button } from './components/button';
import { Texts } from '../types';
import { ReadMore } from './read-more';
import { Alert } from './alert';

// @TODO The answer text for readmore should be three seperate paragraphs
// See in ledetekster.ts in nav-dekoratoren line 144. Fixing after NITD.
export type ScreensharingModalProps = {
  texts: Pick<
    Texts,
    | 'footer_del_skjerm'
    | 'delskjerm_modal_beskrivelse'
    | 'delskjerm_modal_start'
    | 'delskjerm_modal_label'
    | 'delskjerm_modal_avbryt'
    | 'delskjerm_modal_feilmelding'
    | 'delskjerm_modal_hjelpetekst_overskrift'
    | 'delskjerm_modal_hjelpetekst_0'
    | 'delskjerm_modal_hjelpetekst_1'
    | 'delskjerm_modal_hjelpetekst_2'
    | 'delskjerm_modal_stengt'
  >;
};

// @TODO: Should make inputs into a component?

export const ScreensharingModal = ({ texts }: ScreensharingModalProps) =>
  html`<dialog
    is="screensharing-modal"
    class="${clsModal.modal} ${cls.screensharingModal}"
  >
    <img src="/public/ikoner/del-skjerm/Veileder.svg" class="${
      cls.avatar
    }" alt=""/>
    <div class="${clsModal.modalWindow} ${cls.content}">
      <h1 class="${clsModal.modalTitle}">${texts.footer_del_skjerm}</h1>
      <p>${texts.delskjerm_modal_beskrivelse}</p>
      <p>
        ${ReadMore({
          question: texts.delskjerm_modal_hjelpetekst_overskrift,
          answer: [
            texts.delskjerm_modal_hjelpetekst_0,
            texts.delskjerm_modal_hjelpetekst_1,
            texts.delskjerm_modal_hjelpetekst_2,
          ],
        })}
      </p>
      <div class="${cls.open}">
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
      <div class="${cls.closed}">
      ${Alert({
        variant: 'error',
        content: texts.delskjerm_modal_stengt,
      })}
      </div>
    </div>
  </dialog>`;
