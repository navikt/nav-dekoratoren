import { SearchResult } from './types';

export default class SearchService {
  constructor(private fetchSearch: (query: string) => Promise<SearchResult>) {}

  async search(query: string) {
    console.log('searching', query);
    return this.fetchSearch(query).then((result) => ({
      hits: result.hits.slice(0, 5),
      total: result.total,
    }));
  }
}
