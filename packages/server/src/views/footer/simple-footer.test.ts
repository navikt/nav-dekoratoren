import { expect, test } from 'bun:test';
import html from 'decorator-shared/html';
import { SimpleFooter } from './simple-footer';

const links = [
  {
    content: 'Personvern og informasjonskapsler',
    url: '/no/nav-og-samfunn/om-nav/personvern-i-arbeids-og-velferdsetaten',
  },
  {
    content: 'Tilgjengelighet',
    url: '/tilgjengelighet',
  },
  {
    content: html`Del skjerm<svg
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
      </svg>`,
    url: '#',
  },
];

test('renders simple footer', async () => {
  expect(
    SimpleFooter({
      links,
      texts: {
        share_screen: 'Del skjerm',
      },
    }),
  ).toMatchSnapshot();
});
