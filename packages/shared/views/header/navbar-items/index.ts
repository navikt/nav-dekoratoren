import { ComplexHeaderNavbarItems } from './complex-header-navbar-items';
import { Texts } from 'decorator-shared/texts';
import { Node } from '../../../types';
import { SimpleHeaderNavbarItems } from './simple-header-navbar-items';

// Can maybe have a discriminated union here
export type HeaderNavbarItemsProps = {
  innlogget: boolean;
  texts: Texts;
  myPageMenu: Node[];
  name?: string;
};

export function getHeaderNavbarItems(
  props: HeaderNavbarItemsProps,
  simple: boolean,
) {
  if (!simple) {
    return ComplexHeaderNavbarItems(props);
  }
  return SimpleHeaderNavbarItems(props);
}
