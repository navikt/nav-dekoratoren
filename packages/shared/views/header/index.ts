import { Node } from '../../types';
import { ComplexHeader } from './complex-header';
import { SimpleHeader } from './simple-header';
import { Texts } from 'decorator-shared/types';
import {
  AvailableLanguage,
  Breadcrumb,
  Context,
  Params,
  UtilsBackground,
} from 'decorator-shared/params';
import { ContextLink } from '../../context';

export const utilsBackgroundClasses = {
  white: 'decorator-utils-container_white',
  gray: 'decorator-utils-container_gray',
  transparent: 'decorator-utils-container_transparent',
  '': '',
} as const;

export type HeaderProps = {
  isNorwegian: boolean;
  mainMenu?: Node[];
  contextLinks: ContextLink[];
  context: Context;
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
