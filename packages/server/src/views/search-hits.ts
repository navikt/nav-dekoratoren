import aksel from "decorator-client/src/styles/aksel.module.css";
import cls from "decorator-client/src/styles/search-hits.module.css";
import utils from "decorator-client/src/styles/utils.module.css";
import { ArrowRightIcon } from "decorator-icons";
import html, { unsafeHtml } from "decorator-shared/html";
import { Context } from "decorator-shared/params";
import i18n from "../i18n";

export type SearchHitsProps = {
    results: {
        total: number;
        hits: {
            displayName: string;
            highlight: string;
            href: string;
        }[];
    };
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
                class="${aksel["navds-link"]}"
            >
                ${i18n("change_search_filter")}
            </a>
        </div>
        ${total > 0
            ? html`
                  <ul class="${cls.searchHitList}">
                      ${hits.map(
                          (hit) => html`
                              <li>
                                  <search-hit>
                                      <a
                                          href="${hit.href}"
                                          class="${cls.searchHit}"
                                      >
                                          <h2 class="${cls.title}">
                                              ${hit.displayName}
                                          </h2>
                                          <div>
                                              ${unsafeHtml(hit.highlight)}
                                          </div>
                                      </a>
                                  </search-hit>
                              </li>
                          `,
                      )}
                  </ul>
                  <a
                      class="${cls.searchMoreHits}"
                      href="https://www.nav.no/sok?ord=${query}"
                  >
                      ${i18n("more_hits")}
                      ${ArrowRightIcon({
                          className: utils.icons,
                      })}
                  </a>
              `
            : null}
    </div>
`;
