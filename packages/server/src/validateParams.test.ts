import { describe, expect, it } from 'bun:test';
import { parseBooleanParam, validateParams } from './validateParams';

describe('Parsing boolean query paramters', () => {
    it('"true" should return a boolean true', () => {
        expect(parseBooleanParam('true')).toEqual(true)
    })
    it('should reflect boolean if passed directly', () => {
        expect(parseBooleanParam(true)).toEqual(true)
    })
    it('Anything else should return false', () => {
        expect(parseBooleanParam({})).toEqual(false)
        expect(parseBooleanParam([])).toEqual(false)
        expect(parseBooleanParam([1, 2, 3])).toEqual(false)
    })
})

describe('Interpolating with defaults', () => {
    it('should return the default value if the key is not present', () => {
        const params = validateParams({})

        expect(params.shareScreen).toEqual(true)
    })

    it('should override the default value if the key is present', () => {
        const params = validateParams({
            shareScreen: 'false'
        })

        expect(params.shareScreen).toEqual(false)
    })
})
