import type { AvailableLanguage, Breadcrumb, UtilsBackground } from '@/params';
import { html } from '@/utils';
import { Texts } from '@/texts';
import { Breadcrumbs } from '@/views/breadcrumbs';
import LanguageSelector from '@/views/language-selector';
import { utilsBackgroundClasses } from '.';

export function SimpleHeader({
  availableLanguages,
  breadcrumbs,
  utilsBackground,
}: {
  texts: Texts;
  innlogget: boolean;
  availableLanguages: AvailableLanguage[];
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
}) {
  return html`
    <div id="header-withmenu">
      <div
        id="menu-background"
      ></div>
      <header
        class="siteheader"
      >
        <div
          class="hovedmeny-wrapper"
        >
          <div class="hovedmeny-content">
            <img src="/ikoner/meny/nav-logo-black.svg" alt="NAV" />
          </div>
      </header>
      <div class="decorator-utils-container ${
        utilsBackgroundClasses[utilsBackground]
      }">
        <!-- ${Breadcrumbs({ breadcrumbs })} -->
        ${LanguageSelector({ availableLanguages })}
      </div>
    </div>
  `;
}
