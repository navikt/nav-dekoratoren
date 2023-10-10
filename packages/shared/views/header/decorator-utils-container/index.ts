import html from '../../../html';
import { UtilsBackground } from '../../../params';
import { Breadcrumbs, BreadcrumbsProps } from './breadcrumbs';
import { LanguageSelector, LanguageSelectorProps } from './language-selector';

export type DecoratorUtilsContainerProps = {
  utilsBackground: UtilsBackground;
} & BreadcrumbsProps &
  LanguageSelectorProps;

const utilsBackgroundClasses = {
  white: 'decorator-utils-container_white',
  gray: 'decorator-utils-container_gray',
  transparent: 'decorator-utils-container_transparent',
  '': '',
};

export const DecoratorUtilsContainer = ({
  utilsBackground,
  breadcrumbs,
  availableLanguages,
}: DecoratorUtilsContainerProps) => html`
  <div
    class="decorator-utils-container ${utilsBackgroundClasses[utilsBackground]}"
  >
    ${Breadcrumbs({ breadcrumbs })} ${LanguageSelector({ availableLanguages })}
  </div>
`;
