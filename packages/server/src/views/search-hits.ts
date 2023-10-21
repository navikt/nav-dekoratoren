import html from 'decorator-shared/html';
import { SearchResult, Texts } from 'decorator-shared/types';
import cls from 'decorator-client/src/styles/search-hits.module.css';
import { ForwardChevron } from 'decorator-shared/views/icons';

export type SearchHitsProps = {
  results: SearchResult;
  query: string;
  texts: Texts;
};

export const SearchHits = ({
  results: { hits, total },
  query,
  texts,
}: SearchHitsProps) => html`
  <div class="${cls.searchHits}">
    ${total === 0
      ? html`<h2 class="${cls.title}">${texts.no_hits_for} (${query})</h2>`
      : html`<ul class="${cls.searchHitList}">
            ${hits.map(
              (hit, index) => html`
                <li>
                  <a
                    href="${hit.href}"
                    class="${cls.searchHit}"
                    is="lenke-med-sporing"
                    data-analytics-event-args="${JSON.stringify({
                      eventName: 'resultat-klikk',
                      destinasjon: '[redacted]',
                      sokeord: '[redacted]',
                      treffnr: index + 1,
                    })}"
                  >
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
            <a href="https://www.nav.no/sok?ord=${query}">
              ${texts.see_all_hits} ("${query}")
            </a>
          </div>`}
  </div>
`;
