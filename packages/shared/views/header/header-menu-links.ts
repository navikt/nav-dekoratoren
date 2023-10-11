import { Node } from '../../types';
import html from '../../html';
import { ForwardChevron } from '../icons/forward-chevron';
import { Context } from '../../params';

import classes from 'decorator-client/src/styles/header.module.css';
import contextMenuLinkClasses from 'decorator-client/src/styles/context-menu-link.module.css';
import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing-helpers';
import clsx from 'clsx';
import { AnalyticsEventArgs } from 'decorator-client/src/analytics/constants';

function Link({
  path,
  displayName,
  id,
  className,
  analyticsEventArgs,
}: {
  path?: string;
  displayName?: string;
  analyticsEventArgs?: AnalyticsEventArgs;
  id?: string;
  // fix this
  className?: any;
}) {
  return html`
    <li class="${clsx([classes.menuLink, className])}" id="${id}">
      ${LenkeMedSporing(
        {
          href: path as string,
          // don't really like that we have to do this
          children: html`${displayName}`,
          analyticsEventArgs,
        },
        'chevron',
      )}
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
  // fix this
  className?: any;
}) {
  return html`
    <a
      class="${contextMenuLinkClasses.wrapper}"
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

export type HeaderMenuLinksProps = {
  headerMenuLinks: Node[];
  className?: string;
};

export function HeaderMenuLinks({
  className = '',
  headerMenuLinks,
}: HeaderMenuLinksProps) {
  // Add one for the conext links
  return html`
    <ul class="${classes.headerMenuLinks} ${className}">
      ${headerMenuLinks.map(
        (link) => html`
          <li
            id="${link.id}"
            class="${link.flatten ? classes.flatten : classes.nested}"
          >
            <h3>${link.displayName}</h3>
            <ul class="${classes.menuLinkList}">
              ${link.children.map((child) =>
                Link({
                  ...child,
                  analyticsEventArgs: {
                    category: 'dekorator-meny',
                    action: `${link.displayName}/${child.displayName}`,
                    label: child.path,
                    ...(child.isMyPageMenu && {
                      lenkegruppe: 'innlogget meny',
                    }),
                  },
                }),
              )}
            </ul>
            ${!link.flatten &&
            Link({
              id: `${link.id}_link`,
              displayName: link.displayName,
              path: link.path,
              className: classes.nestedLink,
            })}
          </li>
        `,
      )}
      ${Link({
        displayName: 'Logg inn på min side',
        path: '#',
        className: classes.mobile,
      })}

      <li>
        <ul class="${classes.menuContextLinks}">
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
