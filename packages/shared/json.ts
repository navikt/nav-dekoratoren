/**
 * Tries to parse a JSON string, returning a default value if it fails or.
 * @param value The JSON string to parse.
 * @param defaultValue The default value to return if parsing fails.
 *
 * @example
 * ```ts
 * const value = tryParse<{ foo: string }>(rawJson, { foo: 'default' });
 * // if defined
 * // value = { foo: 'bar' }
 * // if undefined
 * // value = { foo: 'default' }
 * ```
 */

import { ClientParams } from "./params";

export function tryParse<TParsed, TDefault = any>(
    value: string | null,
    defaultValue: TDefault,
) {
    if (!value) return defaultValue;
    try {
        return JSON.parse(value) as TParsed;
    } catch {
        return defaultValue;
    }
}

export function formatParams(params: Partial<ClientParams>) {
    return new URLSearchParams(
        Object.entries(params).map(([k, v]) =>
            Array.isArray(v) ? [k, JSON.stringify(v)] : [k, v?.toString() ?? ""],
        ) as [string, string][],
    );
}
