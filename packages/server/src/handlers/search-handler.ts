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
        `${env.SEARCH_API}?ord=${encodeURIComponent(query)}&f=${context}&preferredLanguage=${language}`,
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
    const result = await fetchSearch({
        query,
        language,
        context,
    });

    if (!result.ok) {
        console.log(`Error fetching search results: ${result.error.message}`);
        return SearchErrorView().render({ language, context });
    }

    return SearchHits({
        results: {
            ...result.data,
            hits: result.data.hits.slice(0, 5),
        },
        query,
    }).render({ language, context });
};
