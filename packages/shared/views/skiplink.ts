import html from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/skiplink.module.css';

export const SkipLink = (text: string) => html`
    <lenke-med-sporing
        href="#maincontent"
        class="${cls.skiplink}"
        data-analytics-event-args="${JSON.stringify({
            category: 'dekorator-header',
            action: 'skiplink',
        })}"
        data-attach-context
    >
        ${text}
    </lenke-med-sporing>
`;
