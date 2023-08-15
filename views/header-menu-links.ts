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
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        focusable="false"
                        role="img"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M9.47 5.97a.75.75 0 0 1 1.06 0l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06L14.44 12 9.47 7.03a.75.75 0 0 1 0-1.06Z"
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
