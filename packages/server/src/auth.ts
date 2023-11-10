import {
  grantTokenXOboToken,
  isInvalidTokenSet,
} from '@navikt/next-auth-wonderwall';
import cookie from 'cookie';

// @TODO: Add access policy rules to tms-varsel-api
export async function exchangeToken(request: Request) {
    const authHeader = request.headers.get('authorization');
    const cookies = cookie.parse(request.headers.get('cookie') as string);
    const testToken = cookies['sso-dev.nav.no'] as string;

    console.log('This is the auth header', authHeader)
  const accessToken = request.headers
    .get('authorization')!
    .replace('Bearer ', '')!;
  console.log('access1', accessToken);

  const tokenX = await grantTokenXOboToken(
    testToken,
    'dev-gcp:min-side:tms-varsel-api',
  );

  console.log(tokenX)

  if (isInvalidTokenSet(tokenX)) {
    throw new Error(
      `Unable to exchange token for tms-varsel-api token, reason: ${tokenX.message} -- ${JSON.stringify(request.headers)}`,
      {
        cause: tokenX.error,
      },
    );
  }
  console.log('token', tokenX);

  return `Bearer ${tokenX}`;
}
