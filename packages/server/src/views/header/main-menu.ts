import html from 'decorator-shared/html';
import { MainMenuContextLink, LinkGroup, Texts } from 'decorator-shared/types';
import cls from 'decorator-client/src/styles/main-menu.module.css';

export type MainMenuProps = {
  title: string;
  texts: Texts;
  frontPageUrl: string;
  links?: LinkGroup[];
  contextLinks?: MainMenuContextLink[];
};

export function MainMenu({
  title,
  texts,
  frontPageUrl,
  links,
  contextLinks,
}: MainMenuProps) {
  return html`<div class="${cls.mainMenu}">
    <div class="${cls.content}">
      <div class="${cls.header}">
        <h2 class="${cls.title}">${title}</h2>
        <a
          href="${frontPageUrl}"
          class="${cls.link}"
          is="lenke-med-sporing"
          data-attach-context
          data-analytics-event-args="${JSON.stringify({
            category: 'dekorator-meny',
            action: 'hovedmeny/forsidelenke',
            label: frontPageUrl,
          })}"
          >${texts.to_front_page}</a
        >
      </div>
      <div class="${cls.links}">
        ${links?.map(
          ({ heading, children }) => html`
            <div class="${cls.linkGroup}">
              <h3 class="${cls.linkGroupHeading}">${heading}</h3>
              <ul class="${cls.linkList}">
                ${children.map(
                  ({ content, url }) =>
                    html`<li>
                      <a
                        href="${url}"
                        class="${cls.link}"
                        is="lenke-med-sporing"
                        data-attach-context
                        data-analytics-event-args="${JSON.stringify({
                          category: 'dekorator-meny',
                          action: `${heading}/${content}`,
                          label: url,
                        })}"
                        >${content}</a
                      >
                    </li>`,
                )}
              </ul>
            </div>
          `,
        )}
      </div>
    </div>
    <div class="${cls.contextLinks}">
      ${contextLinks?.map(
        ({ content, url, description }) =>
          html`<a
            href="${url}"
            class="${cls.contextLink}"
            is="lenke-med-sporing"
            data-attach-context
            data-analytics-event-args="${JSON.stringify({
              category: 'dekorator-meny',
              action: 'arbeidsflate-valg',
              label: content,
            })}"
          >
            <div class="${cls.contextLinkTitle}">${content}</div>
            ${description &&
            html`<div class="${cls.contextLinkDescription}">
              ${description}
            </div>`}
          </a>`,
      )}
    </div>
  </div>`;
}
