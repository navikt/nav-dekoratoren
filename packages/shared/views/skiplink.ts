import html from 'decorator-shared/html';
import cls from './skiplink.module.css';

export const SkipLink = () => html`
  <a
    is="lenke-med-sporing"
    href="#maincontent"
    class="${cls.skiplink}"
    data-analytics-event-args="${JSON.stringify({
      category: 'dekorator-header',
      action: 'skiplink',
    })}"
    data-attach-context
  >
    Hopp til hovedinnhold
  </a>
`;
