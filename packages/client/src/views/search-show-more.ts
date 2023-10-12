import html from 'decorator-shared/html';
import cls from './search-show-more.module.css';

export function SearchShowMore({
  word,
  total,
}: {
  word: string;
  total: number;
}) {
  return html`
    <div class="${cls.showMore}">
      <div>Viser 5 av ${total.toString()} resultater.</div>
      <a href="https://www.nav.no/sok?ord=${word}">Se alle treff ("${word}")</a>
    </div>
  `;
}
