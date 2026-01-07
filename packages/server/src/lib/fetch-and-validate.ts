import { Result, ResultType } from "../result";
import { ZodType } from "zod";
import { logger } from "decorator-shared/logger";

type FetchAndValidate = <ResponseData>(
    ...args: [...Parameters<typeof fetch>, schema: ZodType<ResponseData>]
) => Promise<ResultType<ResponseData>>;

const parseAndValidateResponse = <ResponseData>(
    response: unknown,
    schema: ZodType<ResponseData>,
): ResultType<ResponseData> => {
    const validatedResponse = schema.safeParse(response);

    if (!validatedResponse.success) {
        const msg = `Error parsing response - ${validatedResponse.error}`;
        logger.error(msg);
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
            logger.error(msg);
            return Result.Error(msg);
        });
