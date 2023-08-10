import { html } from '../utils';
import { Texts } from '../texts';
import { IconButton, ToggleIconButton } from './components/icon-button';
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
        document.getElementById('menu-background')?.classList.toggle('active');
      },
    })}
    <div
      id="sok-dropdown"
      class="absolute top-[79px] hidden bg-white pt-2 pb-4 translate-x-[-50%] px-12 rounded-b-medium max-w-[700px] w-full"
    >
      <div class="grid gap-2">
        <label for="search-input" class="text-lg font-bold block"
          >Søk på nav.no</label
        >
        <div class="flex">
          <input
            id="search-input"
            type="text"
            class="border-2 rounded-l-medium border-blue-500 p-3 max-w-[600px] w-full focus-visible:outline-0"
          />
          ${IconButton({
            Icon: SearchIcon,
            text: 'Søk',
            className: 'bg-blue-500 rounded-l-none text-white',
          })}
        </div>
      </div>
      <div id="search-hits">
        <ul class="mt-4"></ul>
        <div id="show-more" class="mt-4"></div>
      </div>
    </div>
  `;
}
