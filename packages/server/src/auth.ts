import {
  grantTokenXOboToken,
  isInvalidTokenSet,
} from '@navikt/next-auth-wonderwall';

// @TODO: Add access policy rules to tms-varsel-api
export async function exchangeToken(request: Request) {
  console.log('exchangeToken');
  const accessToken = request.headers
    .get('Authorization')!
    .replace('Bearer ', '')!;
  console.log('access1', accessToken);

  const tokenX = await grantTokenXOboToken(
    accessToken,
    'dev-gcp:min-side:tms-varsel-api',
  );

  if (isInvalidTokenSet(tokenX)) {
    throw new Error(
      `Unable to exchange token for tms-varsel-api token, reason: ${tokenX.message}`,
      {
        cause: tokenX.error,
      },
    );
  }
  console.log('token', tokenX);

  return `Bearer ${tokenX}`;
}
