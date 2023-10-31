import cls from '../styles/inputs.module.css';
import screensharingCls from '../styles/screensharing.module.css'

class ScreensharingModal extends HTMLDialogElement {
  input!: HTMLInputElement;
  confirmButton!: HTMLButtonElement;
  cancelButton!: HTMLButtonElement;
  errorList!: HTMLUListElement;
  code: string = '';

  handleWindowClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node)) {
      this.open = false;
    }
  };

  validateInput () {
      if (!this.code || this.code.length !== 5 || !this.code.match(/^[0-9]+$/)) {
        this.input.classList.add(cls.invalid)
        this.errorList.classList.add(cls.showErrors)
      }
  }

  clearErrors() {
      this.errorList.classList.remove(cls.showErrors)
  }


  load() {
      // Scroll to top when opened
      window.scrollTo(0, 0);
      this.input = this.querySelector('input#screensharing_code') as HTMLInputElement;
      this.confirmButton = this.querySelector('button#screensharing-confirm') as HTMLButtonElement;
      this.cancelButton = this.querySelector('button#screensharing-cancel') as HTMLButtonElement;
      this.errorList = this.querySelector('ul') as HTMLUListElement;

      this.input.addEventListener('input', () => {
          this.clearErrors();
          this.code = this.input.value;
      })

      this.confirmButton.addEventListener('click', () => {
          console.log('Confirm button clicked');
          this.validateInput();
      });

      this.cancelButton.addEventListener('click', () => {
          this.close()
      });

      const isOpen = window.__DECORATOR_DATA__.params.shareScreen && window.__DECORATOR_DATA__.features['dekoratoren.skjermdeling'];
      if (!isOpen) {
          this.classList.add(screensharingCls.isClosed);
      }

  }

  connectedCallback() {
      // Need to do this otherwise decorator data has not been hydrated
      window.addEventListener('load', this.load.bind(this))
  }

  disconnectedCallback() {
    window.removeEventListener('load', this.load)
  }
}


class ScreenshareButton extends HTMLButtonElement {
    handleClick() {
        const dialog = document.querySelector('dialog[is="screensharing-modal"]') as HTMLDialogElement;
        dialog.showModal();
        dialog.open = true;

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
