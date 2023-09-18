import { Node } from '../../types';
import { ComplexHeader } from './complex-header';
import { SimpleHeader } from './simple-header';
import { Texts } from 'decorator-shared/texts';
import {
  AvailableLanguage,
  Breadcrumb,
  Params,
  UtilsBackground,
} from 'decorator-shared/params';

export const utilsBackgroundClasses = {
  white: 'decorator-utils-container_white',
  gray: 'decorator-utils-container_gray',
  transparent: 'decorator-utils-container_transparent',
  '': '',
} as const;

export type HeaderProps = {
  isNorwegian: boolean;
  mainMenu?: Node[];
  texts: Texts;
  headerMenuLinks?: Node[];
  innlogget: boolean;
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
  availableLanguages: AvailableLanguage[];
  myPageMenu?: Node[];
} & Pick<Params, 'simple'>;

export function getHeader(props: HeaderProps) {
  if (!props.simple) {
    return ComplexHeader(props);
  }
  return SimpleHeader(props);
}

export function Header(props: HeaderProps) {
  return getHeader(props);
}
