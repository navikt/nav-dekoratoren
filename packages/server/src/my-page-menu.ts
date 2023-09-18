import { Node } from 'decorator-shared/types';
import { get, getLangKey } from './buildDataStructure';
import { Language } from 'decorator-shared/params';

export default (children: Node['children'], language: Language) => {
  const menu = {
    children,
    displayName: '',
    id: '',
  };

  return get(menu, `${getLangKey(language)}.Header.My page menu`)?.children;
};
