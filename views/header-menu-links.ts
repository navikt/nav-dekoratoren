import { HeaderMenuLinksData } from '@/utils';

import { html } from '../utils';
import { replaceElement } from '@/client/utils';
import { ForwardChevron } from './icons/forward-chevron';

// Discuss better way to solve this
export function AddSnarveierListener() {
  document.addEventListener(
    'click',
    (e) => {
      // Check on document level to avoid event listeners being killed
      // TODO: Doesn't bubble correclty ATM. Fix that.
      if (
        e.target &&
        (e.target as HTMLElement).classList.contains('nested-link')
      ) {
        const nestedLink = e.target as HTMLElement;

        if (nestedLink) {
          const menuContent = document.getElementById('menu-content');
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

      if (e.target && (e.target as HTMLElement).id === 'mobil-lukk') {
        const menuContent = document.getElementById('menu-content');
        menuContent?.classList.remove('sub-menu-active');
        // Works now, should we clear it?
      }
    },
    true,
  );
}

function Link({
  path,
  displayName,
  id,
  className,
}: {
  path?: string;
  displayName?: string;
  id?: string;
  className?: string;
}) {
  return html`
    <li class="header-menu-link ${className}" id="${id}">
      <div class="header-menu-link-inner">${ForwardChevron()}</div>
      <a href="${path}">${displayName}</a>
    </li>
  `;
}

export function HeaderMenuLinks({
  cols = '4',
  className = '',
  headerMenuLinks,
}: {
  headerMenuLinks: HeaderMenuLinksData;
  className?: string;
  cols?: '4' | '3';
}) {
  return html`
    <ul class="header-menu-links cols-${cols} ${className}">
      ${headerMenuLinks.map(
        (link) => html`
          <li id="${link.id}" class="${link.flatten ? 'flatten' : 'nested'}">
            <h3>${link.displayName}</h3>
            <ul>
              ${link.children.map((child) => Link(child))}
            </ul>
            ${!link.flatten &&
            Link({
              id: `${link.id}_link`,
              displayName: link.displayName,
              path: link.path,
              className: 'nested-link',
            })}
          </li>
        `,
      )}
      ${Link({
        displayName: 'Logg inn på min side',
        path: '#',
        className: 'mobile',
      })}
    </ul>
  `;
}
