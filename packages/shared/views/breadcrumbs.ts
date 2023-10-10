import { Breadcrumb } from '../params';
import cls from '../utilities.module.css';
import html from '../html';
import { HomeIcon } from './icons/home';
import {
  LenkeMedSporing,
  LenkeMedSporingBase,
} from 'decorator-client/src/views/lenke-med-sporing-helpers';

const analyticsEventArgs = {
  category: 'dekorator-header',
  komponent: 'brødsmule',
} as const;

export type BreadcrumbsProps = { breadcrumbs: Breadcrumb[] };

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return html`
    <nav class="${cls.contentContainer}" id="breadcrumbs-wrapper">
      <ol id="breadcrumbs-list">
        <li>
          ${LenkeMedSporing({
            href: '/',
            analyticsEventArgs: {
              ...analyticsEventArgs,
              action: 'nav.no',
            },
            children: html`
              ${HomeIcon()}
              <span>nav.no</span>
            `,
            defaultStyle: false,
          })}
        </li>
        ${breadcrumbs.map(
          ({ title, url, handleInApp }, index) => html`
            <li class="list-item">
              ${index === breadcrumbs.length - 1
                ? title
                : LenkeMedSporingBase({
                    href: url,
                    analyticsEventArgs: {
                      ...analyticsEventArgs,
                      label: '[redacted]',
                      action: '[redacted]',
                    },
                    children: html`${title}`,
                    defaultStyle: false,
                    extraAttrs: [
                      ['data-handle-in-app', handleInApp ? 'true' : 'false'],
                    ],
                  })}
            </li>
          `,
        )}
      </ol>
    </nav>
  `;
}
