import cls from '../styles/ops-messages.module.css';
import utilsCls from 'decorator-shared/utilities.module.css';

class OpsMessages extends HTMLElement {
  content: HTMLElement;
  constructor() {
    super();
    this.content = document.createElement('div');
    this.content.classList.add(cls.opsMessagesContent);
    this.content.classList.add(utilsCls.contentContainer);
  }

  connectedCallback() {
    fetch(`${window.__DECORATOR_DATA__.env.APP_URL}/ops-messages`)
      .then((res) => res.text())
      .then((html) => {
        if (html) {
          this.setAttribute(
            'aria-label',
            window.__DECORATOR_DATA__.texts.important_info,
          );
          this.content.innerHTML = html;
          this.append(this.content);
        } else {
          this.removeAttribute('aria-label');
          this.content.remove();
        }
      });
  }
}

customElements.define('ops-messages', OpsMessages);
