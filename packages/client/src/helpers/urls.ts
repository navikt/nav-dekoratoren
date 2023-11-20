import { Context, Environment, Params } from 'decorator-shared/params';

export const verifyWindowObj = () => {
  return typeof window !== 'undefined';
};

export const erNavDekoratoren = (): boolean => {
  return (
    (verifyWindowObj() && window.location.href.includes('dekoratoren')) ||
    window.location.href.includes('localhost')
  );
};

const getRedirectUrlLogin = (
  environment: Environment,
  params: Params,
  arbeidsflate: Context,
) => {
  const { MIN_SIDE_URL, MIN_SIDE_ARBEIDSGIVER_URL } = environment;
  const { redirectToUrl, redirectToApp } = params;

  const appUrl = window.location.origin + window.location.pathname;

  if (erNavDekoratoren()) {
    return appUrl;
  }

  if (redirectToUrl) {
    return redirectToUrl;
  }

  if (redirectToApp) {
    return appUrl;
  }

  if (arbeidsflate === 'arbeidsgiver') {
    return MIN_SIDE_ARBEIDSGIVER_URL;
  }

  return MIN_SIDE_URL;
};

export const getLoginUrl = (
  environment: Environment,
  params: Params,
  arbeidsflate: Context,
  overrideLevel?: string,
) => {
  const { LOGIN_URL } = environment;
  const { level } = params;

  const redirectUrl = getRedirectUrlLogin(environment, params, arbeidsflate);

  return `${LOGIN_URL}?redirect=${redirectUrl}&level=${overrideLevel || level}`;
};
