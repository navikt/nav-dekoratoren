import html from '../html';

import cls from 'decorator-client/src/styles/read-more.module.css';

type ReadMoreProps = {
  question: string;
  answer: string;
};

export const ReadMore = (props: ReadMoreProps) => {
  return html`
    <read-more>
      <details class="${cls.details}">
        <summary class="${cls.summary}">${props.question}</summary>
        <p class="${cls.answer}">${props.answer}</p>
      </details>
    </read-more>
  `;
};
