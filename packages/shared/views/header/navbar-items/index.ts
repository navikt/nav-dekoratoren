import { ComplexHeaderNavbarItems } from './complex-header-navbar-items.js';
import { Texts } from 'decorator-shared/texts';
import { MyPageMenu } from 'decorator-shared/utils';
import { SimpleHeaderNavbarItems } from './simple-header-navbar-items.js';

// Can maybe have a discriminated union here
export type HeaderNavbarItemsProps = {
  innlogget: boolean;
  texts: Texts;
  myPageMenu: MyPageMenu;
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
