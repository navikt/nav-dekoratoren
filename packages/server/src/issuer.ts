import { Client, Issuer } from 'openid-client'

import { verifyAndGetTokenXConfig } from './auth-config'

let tokenXIssuer: Issuer<Client>
export async function getTokenXIssuer(): Promise<Issuer<Client>> {
    if (tokenXIssuer == null) {
        const tokenXConfig = verifyAndGetTokenXConfig()

        tokenXIssuer = await Issuer.discover(tokenXConfig.tokenXWellKnownUrl)
    }
    return tokenXIssuer
}

