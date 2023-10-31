import { loadExternalScript } from "./utils";

export const VNGAGE_ID = '83BD7664-B38B-4EEE-8D99-200669A32551' as const;

export const vendorScripts = {
  skjermdeling: `https://account.psplugin.com/${VNGAGE_ID}/ps.js`,
} as const;

export type VngageStates = 'InDialog' | 'Ready';

export type VngageUserState = {
  user: {
    state: VngageStates; // probably more states but couldn't find documentation.
  };
  poi: unknown;
};



// @TODO: Use promise instead of callback?
export function lazyLoadScreensharing(cb: () => void) {
  // Check if it is already loaded to avoid layout shift
  const enabled =
    window.__DECORATOR_DATA__.params.shareScreen &&
    window.__DECORATOR_DATA__.features['dekoratoren.skjermdeling'];

  if (!enabled) {
    cb()
    return;
  }

  window.vngageReady = () => {
      cb()
  };

  loadExternalScript(vendorScripts.skjermdeling);
}

export function useLoadIfActiveSession({
  userState,
}: {
  userState: string | undefined;
}) {
    console.log(userState)
  if (userState && userState !== 'Ready') {
    loadExternalScript(vendorScripts.skjermdeling);
  }
}
