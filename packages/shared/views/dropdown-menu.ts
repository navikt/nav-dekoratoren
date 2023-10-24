import clsx from 'clsx';
import html, { Template } from '../html';
import utilsCls from 'decorator-shared/utilities.module.css';
import cls from 'decorator-client/src/styles/dropdown-menu.module.css';

export type DropdownMenuProps = {
  button: Template;
  dropdownContent: Template;
  dropdownClass?: string;
};

export const DropdownMenu = ({
  button,
  dropdownContent,
  dropdownClass,
}: DropdownMenuProps) =>
  html`<dropdown-menu>
    ${button}
    <div class="${clsx(utilsCls.contentContainer, cls.dropdownMenuContainer)}">
      <div class="${clsx(dropdownClass, cls.dropdownMenuContent)}">
        ${dropdownContent}
      </div>
    </div>
  </dropdown-menu>`;
