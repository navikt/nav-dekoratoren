import { html } from "common-tags";

export const HeaderMenuLinks = () => html`
  <ul class="grid grid-cols-4 gap-4">
    {{#headerMenuLinks}}
    <li>
      <h3 class="text-heading-small font-bold">{{ displayName }}</h3>
      <ul>
        {{#children}}
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
          <a class="text-text-action group-hover:underline" href="{{ path }}"
            >{{ displayName }}</a
          >
        </li>
        {{/children}}
      </ul>
    </li>
    {{/headerMenuLinks}}
  </ul>
`;
