import { hasClass, hasId, replaceElement } from '../utils';

// Discuss better way to solve this
export function addSnarveierListener() {
  document.addEventListener(
    'click',
    (e) => {
      // Check on document level to avoid event listeners being killed
      // TODO: Doesn't bubble correclty ATM. Fix that.
      if (
        hasClass({
          element: e.target as HTMLElement,
          className: 'nested-link',
        })
      ) {
        const nestedLink = e.target as HTMLElement;

        if (nestedLink) {
          const menuContent = document.getElementById('menu-content');
          // @note: Kind of an obfuscated way to do it.
          const id = nestedLink.id.split('_')[0];
          const nested = document.getElementById(id);

          replaceElement({
            selector: '#sub-menu-content > ul',
            html: nested?.innerHTML as string,
          });

          // snarveier.classList.toggle('snarveier--open');
          menuContent?.classList.toggle('sub-menu-active');
        }
      }

      if (
        hasId({
          element: e.target as HTMLElement,
          id: 'mobil-lukk',
        })
      ) {
        const menuContent = document.getElementById('menu-content');
        menuContent?.classList.remove('sub-menu-active');
      }
    },
    true,
  );
}
