type ResultOk<Payload> = { ok: true; data: Payload };
type ResultError = { ok: false; error: Error };

export type ResultType<Payload> = ResultOk<Payload> | ResultError;

export const Result = {
    Error: (error: Error | string): ResultError => ({
        ok: false,
        error: error instanceof Error ? error : new Error(error),
    }),
    Ok: <Payload>(data: Payload): ResultOk<Payload> => ({
        ok: true,
        data,
    }),
};
