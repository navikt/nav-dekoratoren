import globalCls from "decorator-client/src/styles/global.module.css";
import cls from "decorator-client/src/styles/search-hits.module.css";
import html, { unsafeHtml } from "decorator-shared/html";
import { ArrowRight } from "decorator-shared/views/icons";
import { SearchResult } from "../handlers/search-handler";
import i18n from "../i18n";
import { Context } from "decorator-shared/params";

export type SearchHitsProps = {
    results: SearchResult;
    query: string;
    context: Context;
};

export const SearchHits = ({
    results: { hits, total },
    query,
    context,
}: SearchHitsProps) => html`
    <div class="${cls.searchHits}">
        <div>
            <h2 role="alert" class="${cls.heading}">
                ${i18n("search_hits_heading", { total, query, context })}
            </h2>
            <a
                href="https://www.nav.no/sok?ord=${query}"
                class="${globalCls["navds-link"]}"
            >
                ${i18n("change_search_filter")}
            </a>
        </div>
        ${total > 0
            ? html` <ul class="${cls.searchHitList}">
                      ${hits.map(
                          (hit, index) => html`
                              <li>
                                  <lenke-med-sporing
                                      href="${hit.href}"
                                      class="${cls.searchHit}"
                                      data-analytics-event-args="${JSON.stringify(
                                          {
                                              eventName: "resultat-klikk",
                                              destinasjon: "[redacted]",
                                              sokeord: "[redacted]",
                                              treffnr: index + 1,
                                          },
                                      )}"
                                  >
                                      <h2 class="${cls.title}">
                                          ${hit.displayName}
                                      </h2>
                                      <div>${unsafeHtml(hit.highlight)}</div>
                                  </lenke-med-sporing>
                              </li>
                          `,
                      )}
                  </ul>
                  <a
                      class="${cls.searchMoreHits}"
                      href="https://www.nav.no/sok?ord=${query}"
                  >
                      ${i18n("more_hits")}
                      ${ArrowRight({
                          className: cls.searchHitRightArrow,
                      })}
                  </a>`
            : null}
    </div>
`;
