import { formatParams } from 'decorator-shared/json';
import { LoginLevel, type Context, type Params } from 'decorator-shared/params';
import { AppState } from 'decorator-shared/types';
import Cookies from 'js-cookie';
import 'vite/modulepreload-polyfill';
import { type AnalyticsEventArgs } from './analytics/constants';
import * as api from './api';
import { logoutWarningController } from './controllers/logout-warning';
import { onLoadListeners } from './listeners';
import './main.css';
import { useLoadIfActiveSession } from './screensharing';
import './views/breadcrumb';
import './views/context-link';
import './views/decorator-lens';
import { attachLensListener } from './views/decorator-lens';
import './views/decorator-utils';
import './views/dropdown-menu';
import './views/language-selector';
import './views/lenke-med-sporing';
import './views/loader';
import './views/local-time';
import './views/main-menu';
import './views/menu-background';
import './views/notifications';
import './views/ops-messages';
import './views/screensharing';
import './views/search-input';
import './views/search-menu';
import.meta.glob('./styles/*.css', { eager: true });

// Just for testing
window.analyticsEvent = () => {};
window.logPageView = () => Promise.resolve();

type Auth = {
  authenticated: boolean;
  name: string;
  securityLevel: string;
};

const CONTEXTS = ['privatperson', 'arbeidsgiver', 'samarbeidspartner'] as const;

declare global {
  interface Window {
    __DECORATOR_DATA__: AppState;
    loginDebug: {
      expireToken: (seconds: number) => void;
      expireSession: (seconds: number) => void;
    };
    analyticsEvent: (props: AnalyticsEventArgs) => void;
    logPageView: (params: Params, authState: Auth) => Promise<unknown>;
    logAmplitudeEvent: (
      eventName: string,
      eventData: Record<string, any>,
      origin?: string,
    ) => void;
    startTaskAnalyticsSurvey: (state: AppState) => void;
    // For task analytics, should have better types?
    TA: any;
    dataLayer: any;
    vngageReady: () => void;
  }
}

window.__DECORATOR_DATA__ = JSON.parse(
  document.getElementById('__DECORATOR_DATA__')?.innerHTML ?? '',
);

window.__DECORATOR_DATA__.env = {
  MIN_SIDE_URL: import.meta.env.VITE_MIN_SIDE_URL,
  LOGIN_URL: import.meta.env.VITE_LOGIN_URL,
  LOGOUT_URL: import.meta.env.VITE_LOGOUT_URL,
  MIN_SIDE_ARBEIDSGIVER_URL: import.meta.env.VITE_MIN_SIDE_ARBEIDSGIVER_URL,
  XP_BASE_URL: import.meta.env.VITE_XP_BASE_URL,
  APP_URL: import.meta.env.VITE_APP_URL,
};

const updateDecoratorParams = (params: Partial<Params>) => {
  window.__DECORATOR_DATA__.params = {
    ...window.__DECORATOR_DATA__.params,
    ...params,
  };

  window.dispatchEvent(
    new CustomEvent('paramsupdated', {
      detail: { keys: Object.keys(params) },
    }),
  );
};

updateDecoratorParams({});

onLoadListeners({
  texts: window.__DECORATOR_DATA__.texts,
});

attachLensListener();

if (window.__DECORATOR_DATA__.params.logoutWarning) {
  logoutWarningController(
    window.__DECORATOR_DATA__.params.logoutWarning,
    window.__DECORATOR_DATA__.texts,
  );
}

window.addEventListener('message', (e) => {
  if (e.data.source === 'decoratorClient' && e.data.event === 'ready') {
    window.postMessage({ source: 'decorator', event: 'ready' });
  }
  if (e.data.source === 'decoratorClient' && e.data.event == 'params') {
    ['breadcrumbs', 'availableLanguages', 'utilsBackground'].forEach((key) => {
      if (e.data.payload[key]) {
        updateDecoratorParams({
          [key]: e.data.payload[key],
        });
      }
    });

    const language = e.data.payload.language;
    if (language && language !== window.__DECORATOR_DATA__.params.language) {
      updateDecoratorParams({ language });
      Promise.all(
        ['header', 'footer'].map((key) =>
          fetch(
            `${import.meta.env.VITE_DECORATOR_BASE_URL}/${key}?${formatParams(
              window.__DECORATOR_DATA__.params,
            )}`,
          ).then((res) => res.text()),
        ),
      ).then(([header, footer]) => {
        const headerEl = document.getElementById('decorator-header');
        const footerEl = document.getElementById('decorator-footer');
        if (headerEl && footerEl) {
          headerEl.outerHTML = header;
          footerEl.outerHTML = footer;
          init();
        }
      });
    }

    if (e.data.payload.context) {
      const context = e.data.payload.context;
      if (CONTEXTS.includes(context)) {
        window.dispatchEvent(
          new CustomEvent('activecontext', {
            bubbles: true,
            detail: { context },
          }),
        );
      } else {
        console.warn('Unrecognized context', context);
      }
    }
  }
});

window.addEventListener('activecontext', (event) => {
  updateDecoratorParams({
    context: (event as CustomEvent<{ context: Context }>).detail.context,
  });
});

async function populateLoggedInMenu(authObject: Auth) {
  fetch(
    `${import.meta.env.VITE_DECORATOR_BASE_URL}/user-menu?${formatParams({
      ...window.__DECORATOR_DATA__.params,
      name: authObject.name,
      level: `Level${authObject.securityLevel}` as LoginLevel,
    })}`,
  )
    .then((res) => res.text())
    .then((html) => {
      const userMenu = document.querySelector('user-menu');
      if (userMenu) {
        userMenu.outerHTML = html;
      }
    });
}

const init = () =>
  api.checkAuth({
    onSuccess: async (response) => {
      // @TODO: Need to set up with partytown
      // window.logPageView(window.__DECORATOR_DATA__.params, response);
      // window.startTaskAnalyticsSurvey(window.__DECORATOR_DATA__);

      await populateLoggedInMenu(response);
    },
  });

init();

function handleLogin() {
  const loginLevel = window.__DECORATOR_DATA__.params.level || 'Level4';
  document
    .getElementById('login-button')
    ?.addEventListener('click', async () => {
      window.location.href = `${import.meta.env.VITE_LOGIN_URL}?redirect=${
        window.location.href
      }&level=${loginLevel}`;
    });
}

handleLogin();

// @TODO: Refactor loaders
window.addEventListener('load', () => {
  useLoadIfActiveSession({
    userState: Cookies.get('psCurrentState'),
  });
});
