import html from 'decorator-shared/html';
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
  html`<decorator-utils>
    ${breadcrumbs.length > 0 &&
    html`<nav is="d-breadcrumbs">${Breadcrumbs({ breadcrumbs })}</nav>`}
    ${availableLanguages.length > 0 && LanguageSelector()}
  </decorator-utils>`;
