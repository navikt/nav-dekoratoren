import { verifyAndGetTokenXConfig } from './auth-config';
import jwt from 'jsonwebtoken'
import jose from 'node-jose';
import { v4 as uuid } from 'uuid';

const asKey = async (jwk: any) => {
    if (!jwk) {
      throw Error('JWK Mangler');
    }

    return jose.JWK.asKey(jwk).then((key: any) => {
      return Promise.resolve(key);
    });
  };


 async function createClientAssertion() {
    const tokenxConfig = verifyAndGetTokenXConfig();
    const now = Math.floor(Date.now() / 1000);

    const payload = {
      sub: tokenxConfig.tokenXClientId,
      iss: tokenxConfig.tokenXClientId,
      aud: "dev-gcp:min-side:tms-varsel-api",
      jti: uuid(),
      nbf: now,
      iat: now,
      exp: now + 60, // max 120
    };

    const key = await asKey(tokenxConfig.privateJwk);

    const options: any = {
      algorithm: 'RS256',
      header: {
        kid: key.kid,
        typ: 'JWT',
        alg: 'RS256',
      },
    };

    return jwt.sign(payload, key.toPEM(true), options);
}

async function fetchExchange(subject_token: string) {
    const client_assertion = await createClientAssertion();
    console.log('client_assertion', client_assertion);
    // tokenx.prod-gcp.nav.cloud.nais.io
    const params = new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion,
            subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
            subject_token,
            audience: 'dev-gcp:min-side:tms-varsel-api'
        })

    const response = await fetch(`https://tokenx.dev-gcp.nav.cloud.nais.io/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
        credentials: 'include',
        verbose: true,
    })

    console.log('-----')
    console.log(response)
    console.log('-----')

    return response.text();
}


// @TODO: Add access policy rules to tms-varsel-api
export async function exchangeToken(request: Request) {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        throw new Error('Missing authorization header');
    }

  const accessToken = authHeader.replace('Bearer ', '');
  console.log('access1', accessToken);

  try {
  const exchanged = await fetchExchange(accessToken);
  console.log('exchanged', exchanged);
  return `Bearer ${exchanged}`;
  console.log(exchanged)
  } catch (e) {
    console.log(e)
}
return 'Bearer 123';

}
  // const tokenX = await grantTokenXOboToken(
  //   accessToken,
  //   'dev-gcp:min-side:tms-varsel-api',
  // );
  //
  // console.log('token', tokenX);
  //
  // if (isInvalidTokenSet(tokenX)) {
  //   throw new Error(
  //     `Unable to exchange token for tms-varsel-api token, reason: ${tokenX.message} -- ${JSON.stringify(request.headers)}`,
  //     {
  //       cause: tokenX.error,
  //     },
  //   );
  // }
