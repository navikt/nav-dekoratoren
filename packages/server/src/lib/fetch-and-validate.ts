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
        return Result.Error(
            `Error parsing response - ${validatedResponse.error}`,
        );
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
            return Result.Error(`Failed to fetch from ${url}: ${err}`);
        });
