import { Node } from '../../types';
import html from '../../html';
import { ForwardChevron } from '../icons/forward-chevron';
import { Context } from '../../params';

import classes from 'decorator-client/src/styles/header.module.css';
import contextMenuLinkClasses from 'decorator-client/src/styles/context-menu-link.module.css';
import clsx from 'clsx';

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
    <li class="${clsx([classes.menuLink, className])}" id="${id}">
      <div class="${classes.menuLinkInner}">${ForwardChevron()}</div>
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
    <a
      class="context-menu-link-wrapper"
      href="${context}"
      data-context="${context}"
    >
      <li
        class="${clsx([contextMenuLinkClasses.contextMenuLink, className])}"
        id="${id}"
      >
        <div class="${contextMenuLinkClasses.inner}">
          ${ForwardChevron({
            className: contextMenuLinkClasses.chevron,
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
