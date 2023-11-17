import html, { Template } from '../html';

import cls from 'decorator-client/src/styles/screensharing.module.css';
import clsModal from 'decorator-client/src/styles/modal.module.css';
import clsInputs from 'decorator-client/src/styles/inputs.module.css';

import { Button } from './components/button';
import { Texts, WithTexts } from '../types';
import { ReadMore } from './read-more';
import { Alert } from './alert';
import { match } from 'ts-pattern';

// @TODO The answer text for readmore should be three seperate paragraphs
// See in ledetekster.ts in nav-dekoratoren line 144. Fixing after NITD.
export type ScreensharingModalProps = {
  texts: Texts;
  children: Template;
  status: 'enabled' | 'disabled';
};

// CSS: Classes are confusing with .open .closed
// @TODO: Don't export this, but use it to create two other "components"
// @TODO Refactor typography
const ScreensharingModal = ({
  texts,
  children,
  status,
}: ScreensharingModalProps) =>
  html`<dialog
    is="screensharing-modal"
    class="${clsModal.modal} ${cls.screensharingModal}"
    data-status="${status}"
  >
    <img src="/ikoner/del-skjerm/Veileder.svg" class="${cls.avatar}" alt="" />
    <div class="${clsModal.modalWindow} ${cls.content}">
      <h1 class="${clsModal.modalTitle}">${texts.footer_del_skjerm}</h1>
      <p>${texts.delskjerm_modal_beskrivelse}</p>
      ${ReadMore({
        header: texts.delskjerm_modal_hjelpetekst_overskrift,
        content: [
          texts.delskjerm_modal_hjelpetekst_0,
          texts.delskjerm_modal_hjelpetekst_1,
          texts.delskjerm_modal_hjelpetekst_2,
        ],
      })}
      ${children}
    </div>
  </dialog>`;

export const ScreensharingEnabled = ({ texts }: WithTexts) => {
  return ScreensharingModal({
    texts,
    status: 'enabled',
    children: html`
      <div>
        <label for="screensharing_code" class="${clsInputs.textInputLabel}"
          >${texts.delskjerm_modal_label}</label
        >
        <input
          id="screensharing_code"
          class="${clsInputs.textInput}"
          type="text"
          maxlength="5"
        />
        <ul class="${clsInputs.errorList}">
          <li>${texts.delskjerm_modal_feilmelding}</li>
        </ul>
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
    `,
  });
};

export const ScreensharingDisabledModal = ({ texts }: WithTexts) => {
  return ScreensharingModal({
    texts,
    status: 'disabled',
    children: Alert({
      variant: 'error',
      content: texts.delskjerm_modal_stengt,
    }),
  });
};

export const getModal = ({
  enabled,
  texts,
}: {
  enabled: boolean;
  texts: Texts;
}) => {
  return match(enabled)
    .with(true, () => ScreensharingEnabled({ texts }))
    .with(false, () => ScreensharingDisabledModal({ texts }))
    .exhaustive();
};
