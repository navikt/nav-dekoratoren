import { expect } from "bun:test";

type AnyOkUnion = {
    ok: boolean;
    [key: string]: unknown;
};

export function expectOK<T extends AnyOkUnion>(
    result: T,
): asserts result is Extract<T, { ok: true }> {
    expect(result.ok).toBe(true);
}

export function expectNotOK<T extends AnyOkUnion>(
    result: T,
): asserts result is Extract<T, { ok: false }> {
    expect(result.ok).toBe(false);
}
