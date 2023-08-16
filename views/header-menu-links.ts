import { HeaderMenuLinksData } from '@/utils';
import { html } from '../utils';

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
          <li>
            <h3>${link.displayName}</h3>
            <ul>
              ${link.children.map(
                (child) => html`
                  <li class="header-menu-link">
                    <div class="header-menu-link-inner">
                      <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        focusable="false"
                        role="img"
                        class="chevron__mKXRo"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="m17.414 12-7.707 7.707-1.414-1.414L14.586 12 8.293 5.707l1.414-1.414L17.414 12Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <a href="${child.path}">${child.displayName}</a>
                  </li>
                `,
              )}
            </ul>
          </li>
        `,
      )}
    </ul>
  `;
}
