import html from 'decorator-shared/html';

import cls from 'decorator-client/src/styles/splash-page.module.css';

export function SplashPage() {
  return html`
    <div class="${cls.splashPage}">
      <div class="${cls.splashAlert}">
        <span
          >Hei! Dette er en intern test-side for header og footer på nav.no.
          <a href="https://www.nav.no">Gå til forsiden</a>.
        </span>
      </div>
    </div>
  `;
}
