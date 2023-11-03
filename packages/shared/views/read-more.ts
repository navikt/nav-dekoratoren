import html from '../html';

import cls from 'decorator-client/src/styles/read-more.module.css';

type ReadMoreProps = {
  question: string;
  answer: string[];
};

export const ReadMore = (props: ReadMoreProps) => {
  return html`
    <details class="${cls.details}">
      <summary class="${cls.summary}">${props.question}</summary>
      <div class="${cls.answer}">
        ${props.answer.map((a) => html`<p>${a}</p>`)}
      </div>
    </details>
  `;
};
