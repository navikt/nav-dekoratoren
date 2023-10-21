import html from 'decorator-shared/html';
import cls from 'decorator-client/src/styles/search-show-more.module.css';
import { Texts } from 'decorator-shared/types';

export function SearchShowMore({
  texts,
  word,
  total,
}: {
  texts: Texts;
  word: string;
  total: number;
}) {
  return html`
    <div class="${cls.showMore}">
      <div>
        ${texts.showing} ${Math.min(total, 5).toString()} ${texts.of}
        ${total.toString()} ${texts.results}.
      </div>
      <a href="https://www.nav.no/sok?ord=${word}">Se alle treff ("${word}")</a>
    </div>
  `;
}
