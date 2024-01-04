import html, { Template } from '../html';

import cls from 'decorator-client/src/styles/screensharing-modal.module.css';
import clsModal from 'decorator-client/src/styles/modal.module.css';
import clsInputs from 'decorator-client/src/styles/inputs.module.css';
import { VeilederIllustration } from 'decorator-shared/views/illustrations';

import { Button } from './components/button';
import { Texts, WithTexts } from '../types';
import { ReadMore } from './read-more';
import { Alert } from './alert';
import { match } from 'ts-pattern';

export type ScreensharingModalProps = {
  texts: Texts;
  children: Template;
  status: 'enabled' | 'disabled';
};

const ScreensharingModal = ({
  texts,
  children,
  status,
}: ScreensharingModalProps) => html`
  <screensharing-modal>
    <dialog
      class="${clsModal.modal} ${cls.screensharingModal}"
      data-status="${status}"
    >
      ${VeilederIllustration({ className: cls.avatar })}
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
        <div class="${cls.children}">${children}</div>
      </div>
    </dialog>
  </screensharing-modal>
`;

// @TODO: Implement deterministic ID generation
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
          class="${clsInputs.textInput} ${cls.codeInput}"
          type="text"
          maxlength="5"
          autocomplete="off"
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
          className: cls.confirmButton,
        })}
        ${Button({
          text: texts.delskjerm_modal_avbryt,
          variant: 'ghost',
          bigLabel: true,
          className: cls.cancelButton,
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

export type GetScreensharingModalOptions = {
  enabled: boolean;
  texts: Texts;
};

export const getModal = ({ enabled, texts }: GetScreensharingModalOptions) => {
  return match(enabled)
    .with(true, () => ScreensharingEnabled({ texts }))
    .with(false, () => ScreensharingDisabledModal({ texts }))
    .exhaustive();
};
