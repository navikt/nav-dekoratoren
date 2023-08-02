import { html } from '../utils';
import { Texts } from '../texts';
import { ToggleIconButton } from './components/icon-button';
import { SearchIcon } from './icons/search';

export default function Search({ texts }: { texts: Texts }) {
  return html`
    ${ToggleIconButton({
      id: 'search-button',
      icon: SearchIcon({
        className: 'group-[.active]:hidden block',
      }),
      idleText: texts.search,
      toggledText: texts.close,
      onclick: (el) => {
        el.classList.toggle('active');
        document.getElementById('sok-dropdown')?.classList.toggle('active');
      },
    })}
    <div id="sok-dropdown" class="absolute top-[79px] z-30 w-full hidden">
      <div class="max-w-[1337px] w-full mx-auto flex justify-start">
        <div class="h-80 bg-white max-w-[700px] w-full rounded-b-medium"></div>
      </div>
    </div>
  `;
}
