import { Params } from './params';

export const getLogOutUrl = (params: Params) => {
  if (params.redirectToLogout) {
    return `${params.logoutUrl}?redirect=${params.redirectToUrl}`;
  }

  return params.logoutUrl;
};
