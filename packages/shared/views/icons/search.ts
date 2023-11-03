import clsx from 'clsx';
import html from '../../html';
import cls from './search.module.css';

export type SearchProps = {
  className?: string;
  menuSearch?: boolean;
};

export function SearchIcon({ className = '', menuSearch }: SearchProps) {
  return html`
    <svg
      class="${clsx(className, menuSearch && cls.menuSearch)}"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      aria-hidden="true"
      focusable="false"
      aria-labelledby="menuSearch_:R2oti:"
      role="img"
    >
      <title id="menuSearch_:R2oti:">Søke-ikon</title>
      <circle class="${cls.menuSearch__circle}" cx="10" cy="10" r="7"></circle>
      <path class="${cls.menuSearch__line_1}" d="m15 15 7 7"></path>
      <path class="${cls.menuSearch__line_2}" d="m15 15 7 7"></path>
      <path class="${cls.menuSearch__line_3}" d="m15 15 7 7"></path>
      <path class="${cls.menuSearch__line_4}" d="m15 15 7 7"></path>
    </svg>
  `;
}
