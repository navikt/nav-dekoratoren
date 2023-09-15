import html from '../../../html';
import classes from './link-button.module.css';

type LinkButtonProps = {
  text: string;
};

export function LinkButton({ text }: LinkButtonProps) {
  return html`
    <button class="${classes.linkButton}">
      <span class="${classes.text}"> ${text} </span>
    </button>
  `;
}
