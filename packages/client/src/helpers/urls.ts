import { Context, Environment } from 'decorator-shared/params';

export const verifyWindowObj = () => {
  return typeof window !== 'undefined';
};

export const erNavDekoratoren = (): boolean => {
  return verifyWindowObj() && window.location.href.includes('dekoratoren');
};

const getRedirectUrlLogin = (
  environment: Environment,
  arbeidsflate: Context,
) => {
  const { MIN_SIDE_URL, MINSIDE_ARBEIDSGIVER_URL, params } = environment;

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
    return MINSIDE_ARBEIDSGIVER_URL;
  }

  return MIN_SIDE_URL;
};

export const getLoginUrl = (
  environment: Environment,
  arbeidsflate: Context,
  overrideLevel?: string,
) => {
  const { LOGIN_URL, params } = environment;
  const { level } = params;

  const redirectUrl = getRedirectUrlLogin(environment, arbeidsflate);

  return `${LOGIN_URL}?redirect=${redirectUrl}&level=${overrideLevel || level}`;
};
