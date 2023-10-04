import { Node } from '../../types';
import html from '../../html';
import { ForwardChevron } from '../icons/forward-chevron';
import { Context } from '../../params';

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
      ${ForwardChevron({ className: 'header-menu-link-icon' })}
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
    <li class="context-menu-link-wrapper" id="${id}">
      <a
        class="context-menu-link  ${className}"
        href="${context}"
        data-context="${context}"
      >
        ${ForwardChevron({
          className: 'context-menu-link-icon',
        })}
        <span>${displayName}</span>
      </a>
    </li>
  `;
}

export type HeaderMenuLinkCols = 3 | 4 | 5;

export function HeaderMenuLinks({
  cols = 3,
  className = '',
  headerMenuLinks,
}: {
  headerMenuLinks: Node[];
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
