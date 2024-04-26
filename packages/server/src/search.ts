import { SearchResult } from "decorator-shared/types";
import { env } from "./env/server";

export const search = ({
    query,
    context,
    language,
}: {
    query: string;
    context: string;
    language: string;
}) =>
    fetch(
        `${env.SEARCH_API}?ord=${encodeURIComponent(query)}&f=${context}&preferredLanguage=${language}`,
    )
        .then((res) => res.json() as Promise<SearchResult>)
        .then((result) => ({
            hits: result.hits?.slice(0, 5).map((hit) => ({
                // TODO: kan limit(5) gjøres i søketjenesten
                ...hit,
                highlight: hit.highlight // TODO: replace() i søketjenesten
                    .replace(/<\/?[^>]+(>|$)/g, "") // Remove html
                    .replace(/\[.*?(\])/g, "") // Remove shortcodes
                    .replace(/(\[|<).*?(\(...\))/g, ""), // Remove incomplete html/shortcodes
            })),
            total: result.total,
        }))
        .catch(() => ({
            hits: [],
            total: 0,
        }));
