import clsx from 'clsx';
import cls from '@styles/decorator-utils.module.json';
import html from 'decorator-shared/html';
import {
  AvailableLanguage,
  Breadcrumb,
  UtilsBackground,
} from 'decorator-shared/params';
import utilsCls from '@styles/utilities.module.json';
import { Breadcrumbs } from 'decorator-shared/views/breadcrumbs';
import { LanguageSelector } from './language-selector';

export type DecoratorUtilsProps = {
  breadcrumbs: Breadcrumb[];
  availableLanguages: AvailableLanguage[];
  utilsBackground: UtilsBackground;
};

export const DecoratorUtils = ({
  breadcrumbs,
  availableLanguages,
  utilsBackground,
}: DecoratorUtilsProps) =>
  html`<decorator-utils
    class="${clsx(utilsCls.contentContainer, cls.decoratorUtils, {
      [cls.empty]: availableLanguages.length === 0 && breadcrumbs.length === 0,
      [cls.white]: utilsBackground === 'white',
      [cls.gray]: utilsBackground === 'gray',
    })}"
  >
    <nav is="d-breadcrumbs">${Breadcrumbs({ breadcrumbs })}</nav>
    ${LanguageSelector({ availableLanguages })}
  </decorator-utils>`;
