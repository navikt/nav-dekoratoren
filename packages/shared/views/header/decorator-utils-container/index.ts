import clsx from 'clsx';
import html from '../../../html';
import { UtilsBackground } from '../../../params';
import utils from '../../../utilities.module.css';
import { Breadcrumbs, BreadcrumbsProps } from './breadcrumbs';
import cls from './decorator-utils-container.module.css';
import { LanguageSelector } from './language-selector';

export type DecoratorUtilsContainerProps = {
  utilsBackground: UtilsBackground;
} & BreadcrumbsProps;

export const DecoratorUtilsContainer = ({
  utilsBackground,
  breadcrumbs,
}: DecoratorUtilsContainerProps) =>
  breadcrumbs.length > 0
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
          ${Breadcrumbs({ breadcrumbs })} ${LanguageSelector()}
        </div>
      `
    : null;
