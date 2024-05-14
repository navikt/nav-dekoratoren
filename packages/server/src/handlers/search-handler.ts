import { env } from "../env/server";
import { validParams } from "../validateParams";
import { HandlerFunction, responseBuilder } from "../lib/handler";
import { SearchHits } from "../views/search-hits";
import { texts } from "../texts";
import { ResultType, Result } from "../result";
import { z } from "zod";

type SearchResult = z.infer<typeof resultSchema>;

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

const parseAndValidateResult = (result: unknown): ResultType<SearchResult> => {
    const validatedResult = resultSchema.safeParse(result);
    if (!validatedResult.success) {
        return Result.Error(
            `Error parsing search results - ${validatedResult.error}`,
        );
    }

    return Result.Ok({
        ...validatedResult.data,
        hits: validatedResult.data.hits.slice(0, 5),
    });
};

export const fetchSearch = async ({
    query,
    context,
    language,
}: {
    query: string;
    context: string;
    language: string;
}): Promise<ResultType<SearchResult>> =>
    fetch(
        `${env.SEARCH_API}?ord=${encodeURIComponent(query)}&f=${context}&preferredLanguage=${language}`,
    )
        .then((res) => {
            if (!res.ok) {
                return Result.Error(`${res.status} - ${res.statusText}`);
            }

            return res.json().then(parseAndValidateResult);
        })
        .catch((err) => {
            return Result.Error(`Failed to fetch from search api - ${err}`);
        });

export const searchHandler: HandlerFunction = async ({ query }) => {
    const searchQuery = query.q;

    const result = await fetchSearch({
        query: searchQuery,
        ...validParams(query),
    });

    if (result.ok) {
        return responseBuilder()
            .html(
                SearchHits({
                    results: result.data,
                    query: searchQuery,
                    texts: texts[validParams(query).language],
                }).render(),
            )
            .build();
    }

    return responseBuilder().html("asdf").build();
};
