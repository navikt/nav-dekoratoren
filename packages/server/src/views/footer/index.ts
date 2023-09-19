import type { Language, Params } from 'decorator-shared/params';
import { Node } from 'decorator-shared/types';
import html from 'decorator-shared/html';
import { ComplexFooter } from './complex-footer';
import { Button } from 'decorator-shared/views/components/button';
import { SimpleFooter } from './simple-footer';
import { texts } from 'decorator-shared/texts';

export type FooterProps = {
  texts: {
    to_top: string;
    share_screen: string;
    did_you_find: string;
  };
  personvern?: Node[];
  footerLinks?: Node[];
  language: Language;
} & Pick<Params, 'simple' | 'feedback'>;

function getFooter(props: FooterProps) {
  if (props.simple) {
    return SimpleFooter({
      links: [
        ...(props.personvern?.map(({ displayName, path }) => ({
          content: displayName,
          url: path ?? '#',
        })) ?? []),
        {
          content: html`${texts[props.language].share_screen}<svg
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
      ],
    });
  }
  return ComplexFooter(props);
}

function Feedback({ texts }: { texts: { did_you_find: string } }) {
  return html`
    <div id="feedback">
      <div class="feedback-content">
        <h2>${texts.did_you_find}</h2>
        <div class="mx-4">
          ${Button({ text: 'Ja' })} ${Button({ text: 'Nei' })}
        </div>
      </div>
      <script></script>
    </div>
  `;
}

export function Footer(props: FooterProps) {
  return html`
    <div id="footer-withmenu" class="bg-white">
      ${props.feedback && Feedback({ texts: props.texts })} ${getFooter(props)}
    </div>
  `;
}
