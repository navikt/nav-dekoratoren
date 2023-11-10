import { GrantBody, errors } from 'openid-client'

const OPError = errors.OPError
const RPError = errors.RPError

const createOidcUnknownError = (err: errors.OPError | errors.RPError): string =>
    `Noe gikk galt med token exchange mot TokenX.
     Feilmelding fra openid-client: (${err}).
     HTTP Status fra TokenX: (${err.response?.statusCode} ${err.response?.statusMessage})
     Body fra TokenX: ${JSON.stringify(err.response?.body)}`


export type ValidationResult<ErrorTypes extends string> = 'valid' | ValidationError<ErrorTypes>

export type ValidationError<ErrorTypes extends string> = {
    errorType: ErrorTypes
    message: string
    error?: Error | unknown
}

export type GrantError = {
    errorType: 'OIDC_OP_RP_ERROR' | 'OIDC_UNKNOWN_ERROR' | 'UNKNOWN_ERROR' | 'NO_TOKEN'
    message: string
    error?: Error | unknown
}

export type GrantResult = string | GrantError

export function isInvalidTokenSet(grantResult: GrantResult): grantResult is GrantError {
    return typeof grantResult !== 'string'
}

import { Client } from 'openid-client'
import { JWK } from 'jose'

import { verifyAndGetTokenXConfig } from './auth-config'
import { getTokenXIssuer } from './issuer'

let client: Client | null = null
async function getTokenXAuthClient(): Promise<Client> {
    if (client) return client

    const tokenXConfig = verifyAndGetTokenXConfig()
    const jwk: JWK = JSON.parse(tokenXConfig.privateJwk)

    const issuer = await getTokenXIssuer()
    client = new issuer.Client(
        {
            client_id: tokenXConfig.tokenXClientId,
            token_endpoint_auth_method: 'private_key_jwt',
        },
        { keys: [jwk] },
    )

    return client
}

export async function grantTokenXOboToken(subjectToken: string, audience: string): Promise<GrantResult> {
    // const cacheKey = `tokenx-${subjectToken}-${audience}`
    const client = await getTokenXAuthClient()
    const now = Math.floor(Date.now() / 1000)
    const additionalClaims = {
        clientAssertionPayload: {
            nbf: now,
            aud: client.issuer.metadata.token_endpoint,
        },
    }

    const grantBody: GrantBody = {
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        audience,
        subject_token: subjectToken,
    }

    try {
        const tokenSet = await client.grant(grantBody, additionalClaims)
        if (!tokenSet.access_token) {
            return {
                errorType: 'NO_TOKEN',
                message: 'TokenSet does not contain an access_token',
            }
        }
        return tokenSet.access_token
    } catch (err: unknown) {
        if (err instanceof OPError || err instanceof RPError) {
            return {
                errorType: 'OIDC_OP_RP_ERROR',
                message: createOidcUnknownError(err),
                error: err,
            }
        }

        if (err instanceof Error) {
            return {
                errorType: 'OIDC_UNKNOWN_ERROR',
                message: 'Unknown error from openid-client',
                error: err,
            }
        }

        return {
            errorType: 'UNKNOWN_ERROR',
            message: 'Unknown error',
            error: err,
        }
    }
}

