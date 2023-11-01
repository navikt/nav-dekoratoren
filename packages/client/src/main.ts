import 'vite/modulepreload-polyfill';

import './main.css';

import.meta.glob('./styles/*.css', { eager: true });

import getContent from './get-content';

import './views/lenke-med-sporing';
import * as api from './api';

import { DecoratorUtilsContainer } from 'decorator-shared/views/header/decorator-utils-container';

// Maybe create a file that does this
import './views/language-selector';
import './views/loader';
import './views/decorator-lens';
import './views/local-time';
import './views/menu-background';
import './views/dropdown-menu';
import './views/search-menu';
import './views/search-input';
import './views/main-menu';
import './views/context-link';
import './views/ops-messages';
import './views/screensharing';

import { type Context, type Params } from 'decorator-shared/params';
import { attachLensListener } from './views/decorator-lens';
import { logoutWarningController } from './controllers/logout-warning';

import { addBreadcrumbEventListeners, onLoadListeners } from './listeners';

import { type AnalyticsEventArgs } from './analytics/constants';
import { AppState } from 'decorator-shared/types';
// CSS classe
import headerClasses from './styles/header.module.css';
import menuItemsClasses from './styles/menu-items.module.css';
import loggedInMenuClasses from './styles/logged-in-menu.module.css';
import { formatParams } from 'decorator-shared/json';

// import { AnalyticsCategory } from './analytics/analytics';

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

const updateDecoratorParams = (params: Partial<Params>): Params => {
  window.__DECORATOR_DATA__.params = {
    ...window.__DECORATOR_DATA__.params,
    ...params,
  };

  return window.__DECORATOR_DATA__.params;
};

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
    if (
      e.data.payload.breadcrumbs ||
      e.data.payload.availableLanguages ||
      e.data.payload.utilsBackground
    ) {
      if (e.data.payload.breadcrumbs) {
        updateDecoratorParams({
          breadcrumbs: e.data.payload.breadcrumbs,
        });
      }
      if (e.data.payload.availableLanguages) {
        updateDecoratorParams({
          availableLanguages: e.data.payload.availableLanguages,
        });
      }
      if (e.data.payload.utilsBackground) {
        updateDecoratorParams({
          utilsBackground: e.data.payload.utilsBackground,
        });
      }

      const {
        utilsBackground,
        breadcrumbs = [],
        availableLanguages = [],
      } = window.__DECORATOR_DATA__.params;

      const getUtilsContainer = () => {
        const utilsContainer = document.querySelector(
          '.decorator-utils-container',
        );
        if (utilsContainer) {
          return utilsContainer;
        } else {
          const newUtilsContainer = document.createElement('div');
          document
            .querySelector(`.${headerClasses.siteheader}`)
            ?.after(newUtilsContainer);
          return newUtilsContainer;
        }
      };

      getUtilsContainer().outerHTML =
        DecoratorUtilsContainer({
          utilsBackground,
          breadcrumbs,
          availableLanguages,
        })?.render() ?? '';

      addBreadcrumbEventListeners();
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
      simple: window.__DECORATOR_DATA__.params.simple,
      language: window.__DECORATOR_DATA__.params.language,
      name: authObject.name,
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

api.checkAuth({
  onSuccess: async (response) => {
    window.logPageView(window.__DECORATOR_DATA__.params, response);
    window.startTaskAnalyticsSurvey(window.__DECORATOR_DATA__);

    await populateLoggedInMenu(response);
  },
});

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
