import { html } from "common-tags";

export const SimpleFooter = () => html`
<footer class="simple-footer">
  <style>
    .simple-footer {
      border-top: 2px solid #0067c5;
      background-color: white;
      margin: 0 auto;
      padding: 1rem 3rem;
    }

    .simple-footer__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .simple-footer__link-list {
      display: flex;
      gap: 2rem;
    }

    .simple-footer__link {
      padding: 0.25rem 0;
      color: #0067c5;
      display: flex;
      gap: 0.25rem;
      align-items: center;
      text-decoration: underline;
      text-decoration-thickness: 0.0625em;
      text-underline-offset: 0.15em;
    }
  </style>
  <div class="simple-footer__content">
    <ul class="simple-footer__link-list">
      {{#personvern}}
      <li>
        <a class="simple-footer__link" href="{{ path }}">{{ displayName }}</a>
      </li>
      {{/personvern}}
    </ul>
    <a class="simple-footer__link" href="#">
      {{ share_screen
      }}<svg
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
          d="M2.25 4.5c0-.69.56-1.25 1.25-1.25h17c.69 0 1.25.56 1.25 1.25v11c0 .69-.56 1.25-1.25 1.25h-7.75v2.5H19a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1 0-1.5h5.25v-2.5H3.5c-.69 0-1.25-.56-1.25-1.25v-11Zm1.5.25v10.5h16.5V4.75H3.75Z"
          fill="currentColor"
        ></path>
      </svg>
    </a>
  </div>
</footer>
`;
