import html from '../html';

import cls from 'decorator-client/src/styles/read-more.module.css';

type ReadMoreProps = {
    header: string;
    content: string[];
};

export const ReadMore = (props: ReadMoreProps) => {
    return html`
        <details class="${cls.details}">
            <summary class="${cls.summary}">${props.header}</summary>
            <div class="${cls.answer}">${props.content.map((a) => html`<p>${a}</p>`)}</div>
        </details>
    `;
};
