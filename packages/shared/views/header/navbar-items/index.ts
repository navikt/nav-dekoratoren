import { ComplexHeaderNavbarItems } from './complex-header-navbar-items';
import { Texts } from 'decorator-shared/types';
import { Node } from '../../../types';
import { SimpleHeaderNavbarItems } from './simple-header-navbar-items';
import html from '../../../html';

export type HeaderNavbarItemsProps = {
  innlogget: boolean;
  texts: Texts;
  myPageMenu: Node[];
  name?: string;
};

export function HeaderNavbarItems(
  props: HeaderNavbarItemsProps,
  simple: boolean,
) {
  if (!simple) {
    return ComplexHeaderNavbarItems(props);
  }
  return SimpleHeaderNavbarItems(props);

  return html``;
}
