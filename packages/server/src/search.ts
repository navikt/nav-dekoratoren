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
        .catch((err) => {
            console.error(`Error from search api - ${err}`);

            return {
                hits: [],
                total: 0,
            };
        });
