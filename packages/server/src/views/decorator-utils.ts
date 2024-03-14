import clsx from 'clsx';
import cls from 'decorator-client/src/styles/decorator-utils.module.css';
import html from 'decorator-shared/html';
import { AvailableLanguage, Breadcrumb, UtilsBackground } from 'decorator-shared/params';
import { Texts } from 'decorator-shared/types';
import utilsCls from 'decorator-client/src/styles/utilities.module.css';
import { Breadcrumbs } from 'decorator-shared/views/breadcrumbs';
import { LanguageSelector } from './language-selector';

export type DecoratorUtilsProps = {
    breadcrumbs: Breadcrumb[];
    availableLanguages: AvailableLanguage[];
    localTexts: Texts;
    utilsBackground: UtilsBackground;
    hidden: boolean;
};

export const DecoratorUtils = (
    { breadcrumbs, availableLanguages, localTexts, utilsBackground, hidden }: DecoratorUtilsProps
) => html`
    <decorator-utils
        class="${clsx(utilsCls.contentContainer, cls.decoratorUtils, {
            [cls.hidden]: (availableLanguages.length === 0 && breadcrumbs.length === 0) || hidden,
            [cls.white]: utilsBackground === 'white',
            [cls.gray]: utilsBackground === 'gray',
        })}"
        ${Breadcrumbs({ breadcrumbs, localTexts })}
        ${LanguageSelector({ availableLanguages, localTexts })}
    </decorator-utils>
`;
