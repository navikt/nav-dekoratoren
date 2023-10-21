import html from 'decorator-shared/html';
import { SearchResult, Texts } from 'decorator-shared/types';
import cls from 'decorator-client/src/styles/search-hits.module.css';
import { ForwardChevron } from 'decorator-shared/views/icons';

export type SearchHitsProps = {
  results: SearchResult;
  word: string;
  texts: Texts;
};

export const SearchHits = ({
  results: { hits, total },
  word,
  texts,
}: SearchHitsProps) => html`
  <div class="${cls.searchHits}">
    <ul class="${cls.searchHitList}">
      ${hits.map(
        (hit) => html`
          <li>
            <a href="${hit.href}" class="${cls.searchHit}">
              ${ForwardChevron({ className: cls.chevron })}
              <div>
                <h2 class="${cls.title}">${hit.displayName}</h2>
                <div>${hit.highlight}</div>
              </div>
            </a>
          </li>
        `,
      )}
    </ul>
    <div>
      <div>
        ${texts.showing} ${Math.min(total, 5).toString()} ${texts.of}
        ${total.toString()} ${texts.results}
      </div>
      <a href="https://www.nav.no/sok?ord=${word}">Se alle treff ("${word}")</a>
    </div>
  </div>
`;
