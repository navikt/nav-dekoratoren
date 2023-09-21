import html from '../../../html';
import { DownChevron } from '../../icons/down-chevron';
import classes from './dropdown-button.module.css';

type DropdownButtonProps = {
  icon: string;
  text: string;
  id: string;
};

export function DropdownButton({ text, icon, id }: DropdownButtonProps) {
  return html`
    <button id="${id}" class="icon-button ${classes.linkButton}">
      ${icon}
      <span class="icon-button-span ${classes.text}"> ${text} </span>
      ${DownChevron({
        className: 'chevron',
      })}
    </button>
  `;
}
