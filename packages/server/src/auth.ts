import { grantTokenXOboToken, isInvalidTokenSet } from "@navikt/next-auth-wonderwall"


// @TODO: Add access policy rules to tms-varsel-api
export async function exchangeToken(request: Request) {
    const accessToken = request.headers.get('Authorization')!.replace('Bearer ', '')!

    const tokenX = await grantTokenXOboToken(accessToken, "dev-gcp:min-side:tms-varsel-api");

    if (isInvalidTokenSet(tokenX)) {
        throw new Error(
            `Unable to exchange token for tms-varsel-api token, reason: ${tokenX.message}`,
            {
                cause: tokenX.error,
            },
        )
    }

    return `Bearer ${tokenX}`
}
