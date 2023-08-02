import { html } from '../utils';
import { Texts } from '../texts';
import { ToggleIconButton } from './components/icon-button';
import { SearchIcon } from './icons/search';

export default function Search({ texts }: { texts: Texts }) {
  return html`
    ${ToggleIconButton({
      id: 'search-button',
      Icon: SearchIcon,
      idleText: texts.search,
      toggledText: texts.close,
      onclick: (el) => {
        el.classList.toggle('active');
        document.getElementById('sok-dropdown')?.classList.toggle('active');
      },
    })}
    <div id="sok-dropdown" class="absolute top-[79px] hidden bg-white">
      <input id="search-input" type="text" class="border" />
      <ul id="search-hits"></ul>
    </div>
  `;
}
