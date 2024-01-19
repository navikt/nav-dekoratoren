import { describe, expect, it } from 'bun:test';
import { parseBooleanParam, validateParams } from './validateParams';
import { formatParams } from 'decorator-shared/json';

describe('Parsing boolean query paramters', () => {
    it('"true" should return a boolean true', () => {
        expect(parseBooleanParam('true')).toEqual(true);
    });
    it('should reflect boolean if passed directly', () => {
        expect(parseBooleanParam(true)).toEqual(true);
    });
    it('Anything else should return false', () => {
        expect(parseBooleanParam({})).toEqual(false);
        expect(parseBooleanParam([])).toEqual(false);
        expect(parseBooleanParam([1, 2, 3])).toEqual(false);
    });
});

describe('Interpolating with defaults', () => {
    it('should return the default value if the key is not present', () => {
        const params = validateParams({});

        expect(params.shareScreen).toEqual(true);
    });

    it('should override the default value if the key is present', () => {
        const params = validateParams({
            shareScreen: 'false',
        });

        expect(params.shareScreen).toEqual(false);
    });
});

describe('JSON parsing', () => {
    it('should parse no breadcrumbs as an empty array', () => {
        const params = validateParams({});
        expect(params.breadcrumbs).toEqual([]);
    });

    it('should parse a stringified array of breadcrumbs', () => {
        const base = [
            {
                title: 'Arbeid og opphold i Norge',
                url: '/no/person/flere-tema/arbeid-og-opphold-i-norge',
            },
            {
                title: 'Medlemskap i folketrygden',
            },
        ];
        const params = validateParams(
            Object.fromEntries(
                formatParams({
                    breadcrumbs: base,
                }).entries()
            )
        );

        expect(params.breadcrumbs).toEqual(base);
    });
});
