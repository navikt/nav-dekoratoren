import { html } from '../utils';
import { WebcomponentTemplates } from './components';

export function Index({
  language,
  scripts,
  links,
  header,
  footer,
}: {
  language: string;
  scripts: string;
  links: string;
  header: string;
  footer: string;
}) {
  return html`
    <!doctype html>
    <html lang="${language}">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div id="styles" style="display:none">${links}</div>
        ${WebcomponentTemplates()} ${header}
        <main>main</main>
        ${footer}
        <div id="scripts" style="display:none">${scripts}</div>
      </body>
    </html>
  `;
}
