import { Breadcrumb, UtilsBackground } from '../params';
import { html } from '../utils';

export function Breadcrumbs({
  utilsBackground,
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
  utilsBackground: UtilsBackground;
}) {
  return html`
    <nav
      class="${`py-3 ${utilsBackground}`}"
      data-background="${utilsBackground}"
      id="breadcrumbs-wrapper"
    >
      <ol
        class="flex items-center max-w-[1344px] w-full mx-auto"
        id="breadcrumbs-list"
      >
        <li>
          <a class="flex gap-1 items-center amplitude-link" href="#">
            <svg
              class="text-3xl"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              focusable="false"
              role="img"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.47 2.47a.75.75 0 0 1 1.06 0l7 7c.141.14.22.331.22.53v11a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1-.75-.75v-4.25h-2.5V21a.75.75 0 0 1-.75.75H5a.75.75 0 0 1-.75-.75V10a.75.75 0 0 1 .22-.53l7-7Zm-5.72 7.84v9.94h3.5V16a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4.25h3.5v-9.94L12 4.06l-6.25 6.25Z"
                fill="currentColor"
              ></path>
            </svg>
            <span class="text-blue-500 underline">nav.no</span>
          </a>
        </li>
        ${breadcrumbs.map(
          ({ title, url }, index) => html`
            <li class="flex items-center before:content-chevronRightIcon">
              ${index === breadcrumbs.length - 1
                ? title
                : html`
                    <a
                      class="text-blue-500 underline amplitude-link"
                      href="${url}"
                      >${title}</a
                    >
                  `}
            </li>
          `,
        )}
        <!-- {{#breadcrumbs}} -->
        <!-- <li class="flex items-center before:content-chevronRightIcon"> -->
        <!--   {{^last}} -->
        <!--   <a class="text-blue-500 underline" href="{{ url }}">{{ title }}</a> -->
        <!--   {{/last}} {{#last}} {{ title }} {{/last}} -->
        <!-- </li> -->
        <!-- {{/breadcrumbs}} -->
      </ol>
    </nav>
  `;
}
