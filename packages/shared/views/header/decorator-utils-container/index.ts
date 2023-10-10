import clsx from 'clsx';
import html from '../../../html';
import { UtilsBackground } from '../../../params';
import utils from '../../../utilities.module.css';
import { Breadcrumbs, BreadcrumbsProps } from './breadcrumbs';
import { LanguageSelector, LanguageSelectorProps } from './language-selector';
import cls from './decorator-utils-container.module.css';

export type DecoratorUtilsContainerProps = {
  utilsBackground: UtilsBackground;
} & BreadcrumbsProps &
  LanguageSelectorProps;

export const DecoratorUtilsContainer = ({
  utilsBackground,
  breadcrumbs,
  availableLanguages,
}: DecoratorUtilsContainerProps) =>
  breadcrumbs.length > 0 || availableLanguages.length > 0
    ? html`
        <div
          class="${clsx([
            'decorator-utils-container',
            utils.contentContainer,
            cls.decoratorUtilsContainer,
            {
              [cls.white]: utilsBackground === 'white',
              [cls.gray]: utilsBackground === 'gray',
            },
          ])}"
        >
          ${Breadcrumbs({ breadcrumbs })}
          ${LanguageSelector({ availableLanguages })}
        </div>
      `
    : null;
