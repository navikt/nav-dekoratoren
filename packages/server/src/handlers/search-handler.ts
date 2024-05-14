import { env } from "../env/server";
import { validParams } from "../validateParams";
import { HandlerFunction, responseBuilder } from "../lib/handler";
import { SearchHits } from "../views/search-hits";
import { texts } from "../texts";
import { ResultType } from "../result";
import { z } from "zod";
import { SearchErrorView } from "decorator-shared/views/errors/search-error";
import { fetchAndValidateJson } from "../lib/fetch-and-validate";

export type SearchResult = z.infer<typeof resultSchema>;

const resultSchema = z.object({
    total: z.number(),
    hits: z.array(
        z.object({
            displayName: z.string(),
            highlight: z.string(),
            href: z.string().url(),
        }),
    ),
});

const fetchSearch = async ({
    query,
    context,
    language,
}: {
    query: string;
    context: string;
    language: string;
}): Promise<ResultType<SearchResult>> =>
    fetchAndValidateJson(
        `${env.SEARCH_API}?ord=${encodeURIComponent(query)}&f=${context}&preferredLanguage=${language}`,
        undefined,
        resultSchema,
    );

export const searchHandler: HandlerFunction = async ({ query }) => {
    const searchQuery = query.q;

    const result = await fetchSearch({
        query: searchQuery,
        ...validParams(query),
    });

    if (!result.ok) {
        console.log(`Error fetching search results: ${result.error.message}`);
        return responseBuilder().html(SearchErrorView().render()).build();
    }

    const resultPruned = { ...result.data, hits: result.data.hits.slice(0, 5) };

    return responseBuilder()
        .html(
            SearchHits({
                results: resultPruned,
                query: searchQuery,
                texts: texts[validParams(query).language],
            }).render(),
        )
        .build();
};
