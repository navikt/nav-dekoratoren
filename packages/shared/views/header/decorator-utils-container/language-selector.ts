import html from '../../../html';
import { DownChevronIcon, GlobeIcon } from '../../icons';
import cls from './language-selector.module.css';

export const LanguageSelector = () => html`
  <nav is="language-selector" class="${cls.languageSelector}">
    <button type="button" class="${cls.button}">
      ${GlobeIcon({ className: cls.icon })}
      <span>
        <span lang="nb">Språk</span>/<span lang="en">Language</span>
      </span>
      ${DownChevronIcon({ className: cls.icon })}
    </button>
  </nav>
`;
