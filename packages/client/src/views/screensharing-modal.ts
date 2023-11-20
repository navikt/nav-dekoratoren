import { lazyLoadScreensharing } from '../screensharing';
import cls from '../styles/screensharing-modal.module.css';
import clsInputs from '../styles/inputs.module.css';

class ScreensharingModal extends HTMLDialogElement {
  input!: HTMLInputElement;
  confirmButton!: HTMLButtonElement;
  cancelButton!: HTMLButtonElement;
  errorList!: HTMLUListElement;
  code: string = '';

  validateInput () {
      if (!this.code || this.code.length !== 5 || !this.code.match(/^[0-9]+$/)) {
        this.input.classList.add(clsInputs.invalid)
        this.errorList.classList.add(clsInputs.showErrors)
      }
  }

  clearErrors() {
      this.errorList.classList.remove(clsInputs.showErrors)
  }

  async connectedCallback() {
      this.input = this.querySelector('input#screensharing_code') as HTMLInputElement;
      this.confirmButton = this.querySelector(`.${cls.confirmButton}`) as HTMLButtonElement;
      this.cancelButton = this.querySelector(`.${cls.cancelButton}`) as HTMLButtonElement;
      this.errorList = this.querySelector('ul') as HTMLUListElement;

      this.input.addEventListener('input', () => {
          this.clearErrors();
          this.code = this.input.value;
      })

      this.confirmButton.addEventListener('click', () => {
          this.validateInput();
      });

      this.cancelButton.addEventListener('click', () => {
          this.close()
      });
  }
}


class ScreenshareButton extends HTMLButtonElement {
    handleClick() {
        const dialog = document.querySelector('dialog[is="screensharing-modal"]') as HTMLDialogElement;

        lazyLoadScreensharing(() => {
              dialog.showModal();
        })
    }

    connectedCallback() {
        this.addEventListener('click', this.handleClick);
    }

    disonnectedCallback() {
        this.removeEventListener('click', this.handleClick);
    }
}


customElements.define('screensharing-modal', ScreensharingModal, {
    extends: 'dialog'
});

customElements.define('screenshare-button', ScreenshareButton, {
    extends: 'button'
});
