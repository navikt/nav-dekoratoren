import { SearchResult } from 'decorator-shared/types';
import { env } from './env/server';

export default class SearchService {
    async search({ query, context, language }: { query: string, context: string, language: string }) {
        return fetch(`${env.SEARCH_API}?ord=${query}&f=${context}&preferredLanguage=${language}`)
            .then((res) => res.json() as Promise<SearchResult>).then((result) => ({
                hits: result.hits.slice(0, 5).map(hit => {
                    const cleanedHighlight = hit.highlight?.replace(/<\/?[^>]+(>|$)/g, '') // Remove html
                        .replace(/\[.*?(\])/g, '') // Remove shortcodes
                        .replace(/(\[|<).*?(\(...\))/g, ''); // Remove incomplete html/shortcodes;

                    return {
                        ...hit, highlight: cleanedHighlight,
                    };
                }),
                total: result.total,
            }));
    }
}
