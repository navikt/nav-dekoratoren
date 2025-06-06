import { Context, Language } from "decorator-shared/params";
import { z } from "zod";
import { env } from "../env/server";
import { fetchAndValidateJson } from "../lib/fetch-and-validate";
import { SearchErrorView } from "../views/errors/search-error";
import { SearchHits } from "../views/search-hits";

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
}) =>
    fetchAndValidateJson(
        `${env.SEARCH_API_URL}?ord=${query}&f=${context}&preferredLanguage=${language}`,
        undefined,
        resultSchema,
    );

export const searchHandler = async ({
    query,
    context,
    language,
}: {
    query: string;
    context: Context;
    language: Language;
}): Promise<string> => {
    // Always decode first to ensure the query is never double-encoded
    const queryDecoded = decodeURIComponent(query);
    const queryEncoded = encodeURIComponent(queryDecoded);

    const result = await fetchSearch({
        query: queryEncoded,
        language,
        context,
    });

    if (!result.ok) {
        console.error(
            `Error fetching search results for ${query} - ${result.error.message}`,
        );
        return SearchErrorView().render({ language });
    }

    const searchResult = result.data as SearchResult;

    return SearchHits({
        results: {
            total: searchResult.total,
            hits: searchResult.hits,
        },
        query: queryDecoded,
        context,
    }).render({ language });
};
