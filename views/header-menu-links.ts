import { HeaderMenuLinksData } from "../server";
import { html } from "../utils";

export function HeaderMenuLinks({
  headerMenuLinks,
}: {
  headerMenuLinks: HeaderMenuLinksData;
}) {
  return html`
    <ul class="grid grid-cols-4 gap-4">
      ${headerMenuLinks.map(
        (link) => html`
          <li>
            <h3 class="text-heading-small font-bold">${link.displayName}</h3>
            <ul>
              ${link.children.map(
                (child) => html`
                  <li class="group flex items-start py-2">
                    <div
                      class="text-text-action mr-4 transition group-hover:translate-x-2"
                    >
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
                    <a
                      class="text-text-action group-hover:underline"
                      href="${(child as any).path}"
                      >${child.displayName}</a
                    >
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
