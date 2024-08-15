import { Result, ResultType } from "../result";
import { ZodSchema } from "zod";

type FetchAndValidate = <ResponseData>(
    ...args: [...Parameters<typeof fetch>, schema: ZodSchema<ResponseData>]
) => Promise<ResultType<ResponseData>>;

const parseAndValidateResponse = <ResponseData>(
    response: unknown,
    schema: ZodSchema<ResponseData>,
): ResultType<ResponseData> => {
    const validatedResponse = schema.safeParse(response);

    if (!validatedResponse.success) {
        const msg = `Error parsing response - ${validatedResponse.error}`;
        console.error(msg);
        return Result.Error(msg);
    }

    return Result.Ok(validatedResponse.data);
};

export const fetchAndValidateJson: FetchAndValidate = async (
    url,
    init,
    schema,
) =>
    fetch(url, init)
        .then((res) => {
            if (!res.ok) {
                return Result.Error(
                    `Bad response from ${url}: ${res.status} - ${res.statusText}`,
                );
            }

            return res
                .json()
                .then((json) => parseAndValidateResponse(json, schema));
        })
        .catch((err) => {
            const msg = `Failed to fetch from ${url}: ${err}`;
            console.error(msg);
            return Result.Error(msg);
        });
