import html, { unsafeHtml } from "decorator-shared/html";
import { Texts } from "decorator-shared/types";
import cls from "decorator-client/src/styles/search-hits.module.css";
import { ForwardChevron, ArrowRight } from "decorator-shared/views/icons";
import { SearchResult } from "../handlers/search-handler";
import { Context, Language } from "decorator-shared/params";

export type SearchHitsProps = {
    results: SearchResult;
    query: string;
    texts: Texts;
    language: Language;
    context: Context;
};

export const SearchHits = ({
    results: { hits, total },
    query,
    texts,
    language,
    context,
}: SearchHitsProps) => html`
    <div class="${cls.searchHits}">
        <h2 class="${cls.title}"
                <div role="status">
                    ${total.toString()} ${texts.hits} for &laquo;${query}&raquo
                    ${language !== "en" && ` for ${texts[`sok_rolle_${context}`]}`}
                </div>
                <a href="https://www.nav.no/sok?ord=${query}">
                    ${texts.change_search_filter}
                </a>
                <ul class="${cls.searchHitList}">
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
                                    ${ForwardChevron({
                                        className: cls.chevron,
                                    })}
                                    <div>
                                        <h2 class="${cls.title}">
                                            ${hit.displayName}
                                        </h2>
                                        <div>${unsafeHtml(hit.highlight)}</div>
                                    </div>
                                </lenke-med-sporing>
                            </li>
                        `,
                    )}
                </ul>
                ${
                    total > 0
                        ? html`<div role="status" class="${cls.searchMoreHits}">
                              <a href="https://www.nav.no/sok?ord=${query}">
                                  ${texts.more_hits}
                                  ${ArrowRight({
                                      className: cls.searchHitRightArrow,
                                  })}
                              </a>
                          </div>`
                        : null
                }
    </div>
    `;
