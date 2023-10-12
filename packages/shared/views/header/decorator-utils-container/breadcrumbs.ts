import { Breadcrumb } from '../../../params';
import html from '../../../html';
import cls from './breadcrumbs.module.css';
import { ForwardChevron } from '../../icons';
import { HomeIcon } from '../../icons/home';
import { LenkeMedSporing } from 'decorator-client/src/views/lenke-med-sporing/lenke-med-sporing-helpers';

const analyticsEventArgs = {
  category: 'dekorator-header',
  komponent: 'brødsmule',
} as const;

export type BreadcrumbsProps = { breadcrumbs: Breadcrumb[] };

export const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps) =>
  breadcrumbs.length > 0
    ? html`
        <nav id="breadcrumbs-wrapper">
          <ol class="${cls.list}">
            <li>
              ${LenkeMedSporing({
                href: '/',
                analyticsEventArgs: {
                  ...analyticsEventArgs,
                  action: 'nav.no',
                },
                children: html`
                  ${HomeIcon({ className: cls.svg })}
                  <span class="${cls.span}">nav.no</span>
                `,
                defaultStyle: false,
              })}
            </li>
            ${breadcrumbs.map(
              ({ title, url, handleInApp }, index) => html`
                <li class="${cls.listItem}">
                  ${ForwardChevron()}
                  ${index === breadcrumbs.length - 1
                    ? title
                    : LenkeMedSporing({
                        href: url as string,
                        analyticsEventArgs: {
                          ...analyticsEventArgs,
                          label: '[redacted]',
                          action: '[redacted]',
                        },
                        children: html`${title}`,
                        defaultStyle: false,
                        extraAttrs: [
                          [
                            'data-handle-in-app',
                            handleInApp ? 'true' : 'false',
                          ],
                        ],
                        className: cls.link,
                      })}
                </li>
              `,
            )}
          </ol>
        </nav>
      `
    : null;
