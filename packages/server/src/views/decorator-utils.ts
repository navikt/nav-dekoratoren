import html from 'decorator-shared/html';
import utilsCls from 'decorator-shared/utilities.module.css';
import cls from 'decorator-client/src/views/decorator-utils.module.css';
import { AvailableLanguage, Breadcrumb } from 'decorator-shared/params';
import { Breadcrumbs } from 'decorator-shared/views/header/decorator-utils-container/breadcrumbs';
import { LanguageSelector } from 'decorator-shared/views/header/decorator-utils-container/language-selector';

export type DecoratorUtilsProps = {
  breadcrumbs: Breadcrumb[];
  availableLanguages: AvailableLanguage[];
};

export const DecoratorUtils = ({
  breadcrumbs,
  availableLanguages,
}: DecoratorUtilsProps) =>
  html`<decorator-utils
    class="${(utilsCls.contentContainer, cls.decoratorUtils)}"
  >
    <nav is="d-breadcrumbs">${Breadcrumbs({ breadcrumbs })}</nav>
    ${LanguageSelector({ availableLanguages })}
  </decorator-utils>`;
