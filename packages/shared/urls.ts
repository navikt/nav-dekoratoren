import { Environment, MenuValue } from './types';

const getRedirectUrlLogin = (
  environment: Environment,
  arbeidsflate: MenuValue,
) => {
  const { MIN_SIDE_URL, MINSIDE_ARBEIDSGIVER_URL, PARAMS } = environment;

  const { redirectToUrl, redirectToApp } = PARAMS;

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

  if (arbeidsflate === MenuValue.ARBEIDSGIVER) {
    return MINSIDE_ARBEIDSGIVER_URL;
  }

  return MIN_SIDE_URL;
};

export const getLoginUrl = (
  environment: Environment,
  arbeidsflate: MenuValue,
  level?: string,
) => {
  const { LOGIN_URL, PARAMS } = environment;
  const { LEVEL } = PARAMS;

  const redirectUrl = getRedirectUrlLogin(environment, arbeidsflate);

  return `${LOGIN_URL}?redirect=${redirectUrl}&level=${level || LEVEL}`;
};
