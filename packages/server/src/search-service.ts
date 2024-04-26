import { SearchResult } from "decorator-shared/types";
import { env } from "./env/server";

type Params = { query: string; context: string; language: string };

const fetchResult = ({ query, context, language }: Params) =>
    fetch(
        `${env.SEARCH_API}?ord=${encodeURIComponent(query)}&f=${context}&preferredLanguage=${language}`,
    ).then((res) => res.json() as Promise<SearchResult>);

export default class SearchService {
    private readonly fetchFunc;

    constructor(fetchFunc = fetchResult) {
        this.fetchFunc = fetchFunc;
    }

    async search(params: Params) {
        return this.fetchFunc(params)
            .then((result) => ({
                hits: result.hits?.slice(0, 5).map((hit) => {
                    const cleanedHighlight = hit.highlight
                        ?.replace(/<\/?[^>]+(>|$)/g, "") // Remove html
                        .replace(/\[.*?(\])/g, "") // Remove shortcodes
                        .replace(/(\[|<).*?(\(...\))/g, ""); // Remove incomplete html/shortcodes;

                    return {
                        ...hit,
                        highlight: cleanedHighlight,
                    };
                }),
                total: result.total,
            }))
            .catch(() => {
                // TODO: proper error handling (error msg in frontend)
                return {
                    hits: [],
                    total: 0,
                };
            });
    }
}
