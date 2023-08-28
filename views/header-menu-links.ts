import { HeaderMenuLinksData } from '@/utils';

import { html } from '../utils';
import { hasClass, hasId, replaceElement } from '@/client/utils';
import { ForwardChevron } from './icons/forward-chevron';
import { Context } from '@/params';

// Discuss better way to solve this
export function AddSnarveierListener() {
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

function ContextLink({
  context,
  displayName,
  id,
  className,
}: {
  context: Context;
  displayName?: string;
  id?: string;
  className?: string;
}) {
  return html`
    <a href="${context}" data-context="${context}">
      <li class="context-menu-link ${className}" id="${id}">
        <div class="context-menu-link-inner">
          ${ForwardChevron({
            className: 'chevron',
          })}
        </div>
        <span>${displayName}</span>
      </li>
    </a>
  `;
}

export type HeaderMenuLinkCols = 3 | 4 | 5;

export function HeaderMenuLinks({
  cols = 3,
  className = '',
  headerMenuLinks,
}: {
  headerMenuLinks: HeaderMenuLinksData;
  className?: string;
  cols?: HeaderMenuLinkCols;
}) {
  // Add one for the conext links
  return html`
    <ul class="header-menu-links cols-${(cols + 1).toString()} ${className}">
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
      <li>
        <ul id="menu-context-links">
          ${ContextLink({
            displayName: 'Privat',
            context: 'privatperson',
          })}
          ${ContextLink({
            displayName: 'Arbeidsgiver',
            context: 'arbeidsgiver',
          })}
          ${ContextLink({
            displayName: 'Samarbeidspartner',
            context: 'samarbeidspartner',
          })}
        </ul>
      </li>
    </ul>
  `;
}
