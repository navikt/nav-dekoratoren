import { describe, test, expect } from 'bun:test';
import SearchService from './search-service';

const hits = new Array(6).fill(0).map((_, i) => ({
    displayName: `Hit ${i}`,
    audience: ['person'],
    createdTime: '2022-02-09T14:51:57.490Z',
    modifiedTime: '2022-02-09T14:51:57.490Z',
    highlight: `highlight ${i}`,
    href: 'example.com',
    language: 'nb',
    hideModifiedDate: true,
    hidePublishDate: false,
}));

const service = new SearchService(() =>
    Promise.resolve({
        hits,
        total: hits.length,
    })
);

describe('search service', () => {
    test('returns first five results', async () => {
        const result = await service.search('word');

        expect(result.hits.length).toBe(5);
        expect(result.total).toBe(6);
    });
});
