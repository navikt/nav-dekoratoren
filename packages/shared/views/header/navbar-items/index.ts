import { ComplexHeaderNavbarItems } from './complex-header-navbar-items';
import { MainMenuContextLink, LinkGroup, Texts } from 'decorator-shared/types';
import { Node } from '../../../types';
import { SimpleHeaderNavbarItems } from './simple-header-navbar-items';

export type HeaderNavbarItemsProps = {
  mainMenuTitle: string;
  frontPageUrl: string;
  innlogget: boolean;
  texts: Texts;
  myPageMenu: Node[];
  name?: string;
  mainMenuLinks: LinkGroup[];
  contextLinks: MainMenuContextLink[];
};

export function HeaderNavbarItems(
  props: HeaderNavbarItemsProps,
  simple: boolean,
) {
  if (!simple) {
    return ComplexHeaderNavbarItems(props);
  }
  return SimpleHeaderNavbarItems(props);
}
