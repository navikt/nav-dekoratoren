import * as oauth from 'oauth4webapi';

const getIssuer = async () => {
  const issuer = new URL(Bun.env.TOKEN_X_WELL_KNOWN_URL!);
  const authServer = await oauth
    .discoveryRequest(issuer)
    .then((response) => oauth.processDiscoveryResponse(issuer, response));
  return authServer;
};

const client: oauth.Client = {
  client_id: process.env.TOKEN_X_CLIENT_ID!,
  token_endpoint_auth_method: 'private_key_jwt',
};

// @TODO: Add access policy rules to tms-varsel-api
export async function exchangeToken(request: Request) {
  const accessToken = request.headers
    .get('Authorization')!
    .replace('Bearer ', '')!;

  const parameters = new URLSearchParams();
  parameters.set('audience', 'dev-gcp:min-side:tms-varsel-api');
  parameters.set('subject_token', accessToken);
  parameters.set('subject_token_type', 'urn:ietf:params:oauth:token-type:jwt');
  /*
  parameters.set(
    'grant_type',
    'urn:ietf:params:oauth:grant-type:token-exchange',
  );
  parameters.set(
    'client_assertion_type',
    'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  );
  */

  const as = await getIssuer();

  const response = await oauth.deviceAuthorizationRequest(
    as,
    client,
    parameters,
    {
      clientPrivateKey: {
        key: JSON.parse(Bun.env.TOKEN_X_PRIVATE_JWK!),
      },
    },
  );

  let challenges: oauth.WWWAuthenticateChallenge[] | undefined;
  if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
    for (const challenge of challenges) {
      console.log('challenge', challenge);
    }
    throw new Error(); // Handle www-authenticate challenges as needed
  }

  const result = await oauth.processClientCredentialsResponse(
    as,
    client,
    response,
  );
  if (oauth.isOAuth2Error(result)) {
    console.log('error', result);
    throw new Error(); // Handle OAuth 2.0 response body error
  } else {
    return `Bearer ${result.access_token}`;
  }
}
