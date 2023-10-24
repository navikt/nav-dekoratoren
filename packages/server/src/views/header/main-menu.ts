import html from 'decorator-shared/html';
import { Link, LinkGroup, Texts } from 'decorator-shared/types';
import cls from 'decorator-client/src/styles/main-menu.module.css';

export type MainMenuProps = {
  title: string;
  texts: Texts;
  homeUrl: string;
  links: LinkGroup[];
  contextLinks: Link[];
};

export function MainMenu({
  title,
  texts,
  homeUrl,
  links,
  contextLinks,
}: MainMenuProps) {
  return html`<div class="${cls.mainMenu}">
    <div class="${cls.content}">
      <div class="${cls.header}">
        <h2 class="${cls.title}">${title}</h2>
        <a href="${homeUrl}" class="${cls.link}">${texts.to_front_page}</a>
      </div>
      <div class="${cls.links}">
        ${links.map(
          ({ heading, children }) => html`
            <div class="${cls.linkGroup}">
              <h3 class="${cls.linkGroupHeading}">${heading}</h3>
              <ul class="${cls.linkList}">
                ${children.map(
                  ({ content, url }) =>
                    html`<li>
                      <a href="${url}" class="${cls.link}">${content}</a>
                    </li>`,
                )}
              </ul>
            </div>
          `,
        )}
      </div>
    </div>
    <div class="${cls.contextLinks}">
      ${contextLinks.map(
        ({ content, url }) =>
          html`<a href="${url}" class="${cls.contextLink}">${content}</a>`,
      )}
    </div>
  </div>`;
}
