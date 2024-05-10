export type Result<Payload> =
    | { ok: true; data: Payload }
    | { ok: false; error: Error };

export const Result = {
    Error: <Payload>(error: Error | string): Result<Payload> => ({
        ok: false,
        error: error instanceof Error ? error : new Error(error),
    }),
    Ok: <Payload>(data: Payload): Result<Payload> => ({
        ok: true,
        data,
    }),
};
