import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { clearCache, ResponseCache } from "../response-cache";

// The ResponseCache uses stale-while-revalidate: get() returns cached value
// immediately while the background fetch runs as microtasks. We need to
// flush the microtask queue to let background fetches complete.
const flushPromises = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

describe("ResponseCache with errorRetryDelay", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        clearCache();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test("returns value on success", async () => {
        const cache = new ResponseCache<string>({
            ttl: 60_000,
            errorRetryDelay: 120_000,
        });
        const callback = vi.fn().mockResolvedValue("data");

        const result = await cache.get("key", callback);

        expect(result).toBe("data");
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("returns empty string on success", async () => {
        const cache = new ResponseCache<string>({
            ttl: 60_000,
            errorRetryDelay: 120_000,
        });
        const callback = vi.fn().mockResolvedValue("");

        const firstResult = await cache.get("key", callback);
        const secondResult = await cache.get("key", callback);

        expect(firstResult).toBe("");
        expect(secondResult).toBe("");
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("returns stale value immediately when within backoff window", async () => {
        const cache = new ResponseCache<string>({
            ttl: 60_000,
            errorRetryDelay: 120_000,
        });
        const callback = vi
            .fn()
            .mockResolvedValueOnce("stale-data")
            .mockResolvedValue(null);

        // Populate cache
        await cache.get("key", callback);

        // Expire the cache and trigger a failing fetch
        vi.advanceTimersByTime(61_000);
        await cache.get("key", callback);
        await flushPromises();

        // Reset call count
        callback.mockClear();

        // Within backoff window — should NOT trigger a new fetch
        await cache.get("key", callback);
        await cache.get("key", callback);
        await cache.get("key", callback);

        expect(callback).not.toHaveBeenCalled();
    });

    test("returns stale value during backoff window", async () => {
        const cache = new ResponseCache<string>({
            ttl: 60_000,
            errorRetryDelay: 120_000,
        });
        const callback = vi
            .fn()
            .mockResolvedValueOnce("stale-data")
            .mockResolvedValue(null);

        await cache.get("key", callback);
        vi.advanceTimersByTime(61_000);
        await cache.get("key", callback);
        await flushPromises();

        const result = await cache.get("key", callback);

        expect(result).toBe("stale-data");
    });

    test("retries after backoff window expires", async () => {
        const cache = new ResponseCache<string>({
            ttl: 60_000,
            errorRetryDelay: 120_000,
        });
        const callback = vi
            .fn()
            .mockResolvedValueOnce("stale-data")
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce("fresh-data");

        await cache.get("key", callback);
        vi.advanceTimersByTime(61_000);
        await cache.get("key", callback);
        await flushPromises();

        // Advance past backoff window
        vi.advanceTimersByTime(121_000);

        // First call triggers background refresh, returns stale
        await cache.get("key", callback);
        await flushPromises();

        // Second call gets the now-updated cache
        const result = await cache.get("key", callback);
        expect(result).toBe("fresh-data");
    });

    test("clears backoff state on clearCache()", async () => {
        const cache = new ResponseCache<string>({
            ttl: 60_000,
            errorRetryDelay: 120_000,
        });
        const callback = vi
            .fn()
            .mockResolvedValueOnce("stale-data")
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce("fresh-data");

        await cache.get("key", callback);
        vi.advanceTimersByTime(61_000);
        await cache.get("key", callback);
        await flushPromises();

        clearCache();

        const result = await cache.get("key", callback);
        expect(result).toBe("fresh-data");
    });

    test("without errorRetryDelay, allows retry on next request after failure", async () => {
        const cache = new ResponseCache<string>({ ttl: 60_000 });
        const callback = vi
            .fn()
            .mockResolvedValueOnce("stale-data")
            .mockResolvedValue(null);

        await cache.get("key", callback);
        vi.advanceTimersByTime(61_000);
        await cache.get("key", callback);
        // Flush so pendingPromises is cleared before next call
        await flushPromises();

        callback.mockClear();

        // Without backoff, the next request is allowed to retry
        await cache.get("key", callback);
        expect(callback).toHaveBeenCalledTimes(1);
    });

    test("clears nextRetryAfter on successful refetch", async () => {
        const cache = new ResponseCache<string>({
            ttl: 60_000,
            errorRetryDelay: 120_000,
        });
        const callback = vi
            .fn()
            .mockResolvedValueOnce("stale-data")
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce("recovered-data");

        await cache.get("key", callback);
        vi.advanceTimersByTime(61_000);
        await cache.get("key", callback);
        await flushPromises();

        // After backoff expires, fetch succeeds
        vi.advanceTimersByTime(121_000);
        await cache.get("key", callback); // triggers background refresh
        await flushPromises(); // wait for cache to update

        callback.mockClear();

        // Cache is now fresh with recovered data
        const result = await cache.get("key", callback);
        expect(result).toBe("recovered-data");
        expect(callback).not.toHaveBeenCalled();
    });
});
